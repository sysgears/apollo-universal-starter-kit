import bcrypt from 'bcryptjs';
import { pick, isEmpty } from 'lodash';
import jwt from 'jsonwebtoken';
import { UserInputError } from 'apollo-server-errors';
import access from '../../access';
import settings from '../../../../../settings';

const createPasswordHash = password => {
  return bcrypt.hash(password, 12) || false;
};

const validateUserPassword = async (user, password, t) => {
  if (!user) {
    // user with provided email not found
    return { usernameOrEmail: t('user:auth.password.validPasswordEmail') };
  }

  if (settings.user.auth.password.confirm && !user.isActive) {
    return { usernameOrEmail: t('user:auth.password.emailConfirmation') };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    // bad password
    return { usernameOrEmail: t('user:auth.password.validPassword') };
  }
};

export default () => ({
  Mutation: {
    async login(
      obj,
      {
        input: { usernameOrEmail, password }
      },
      { req, User }
    ) {
      const user = await User.getUserByUsernameOrEmail(usernameOrEmail);

      const errors = await validateUserPassword(user, password, req.t);
      if (!isEmpty(errors)) throw new UserInputError('Failed valid user password', { errors });

      const tokens = await access.grantAccess(user, req);

      return { user, tokens };
    },
    async register(obj, { input }, { mailer, User, req }) {
      const { t } = req;
      const errors = {};
      const userExists = await User.getUserByUsername(input.username);
      if (userExists) {
        errors.username = t('user:auth.password.usernameIsExisted');
      }

      const emailExists = await User.getUserByEmail(input.email);
      if (emailExists) {
        errors.email = t('user:auth.password.emailIsExisted');
      }

      if (!isEmpty(errors)) throw new UserInputError('Failed reset password', { errors });

      let userId = 0;
      if (!emailExists) {
        let isActive = false;
        if (!settings.user.auth.password.confirm) {
          isActive = true;
        }

        const passwordHash = await createPasswordHash(input.password);

        [userId] = await User.register({ ...input, isActive, passwordHash });

        // if user has previously logged with facebook auth
      } else {
        await User.updatePassword(emailExists.userId, input.password);
        userId = emailExists.userId;
      }

      const user = await User.getUser(userId);

      if (mailer && settings.user.auth.password.sendConfirmationEmail && !emailExists && req) {
        // async email
        jwt.sign({ user: pick(user, 'id') }, settings.user.secret, { expiresIn: '1d' }, (err, emailToken) => {
          const encodedToken = Buffer.from(emailToken).toString('base64');
          const url = `${__WEBSITE_URL__}/confirmation/${encodedToken}`;
          mailer.sendMail({
            from: `${settings.app.name} <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Confirm Email',
            html: `<p>Hi, ${user.username}!</p>
            <p>Welcome to ${settings.app.name}. Please click the following link to confirm your email:</p>
            <p><a href="${url}">${url}</a></p>
            <p>Below are your login information</p>
            <p>Your email is: ${user.email}</p>
            <p>Your password is: ${input.password}</p>`
          });
        });
      }

      return { user };
    },
    async forgotPassword(obj, { input }, context) {
      try {
        const localAuth = pick(input, 'email');
        const user = await context.User.getUserByEmail(localAuth.email);

        if (user && context.mailer) {
          // async email
          jwt.sign(
            { email: user.email, password: user.passwordHash },
            settings.user.secret,
            { expiresIn: '1d' },
            (err, emailToken) => {
              // encoded token since react router does not match dots in params
              const encodedToken = Buffer.from(emailToken).toString('base64');
              const url = `${__WEBSITE_URL__}/reset-password/${encodedToken}`;
              context.mailer.sendMail({
                from: `${settings.app.name} <${process.env.EMAIL_USER}>`,
                to: user.email,
                subject: 'Reset Password',
                html: `Please click this link to reset your password: <a href="${url}">${url}</a>`
              });
            }
          );
        }
      } catch (e) {
        // don't throw error so you can't discover users this way
      }
    },
    async resetPassword(
      obj,
      { input },
      {
        req: { t },
        User
      }
    ) {
      const errors = {};

      const reset = pick(input, ['password', 'passwordConfirmation', 'token']);
      if (reset.password !== reset.passwordConfirmation) {
        errors.password = t('user:auth.password.passwordsIsNotMatch');
      }

      if (reset.password.length < settings.user.auth.password.minLength) {
        errors.password = t('user:auth.password.passwordLength', { length: settings.user.auth.password.minLength });
      }

      if (!isEmpty(errors)) throw new UserInputError('Failed reset password', { errors });

      const token = Buffer.from(reset.token, 'base64').toString();
      const { email, password } = jwt.verify(token, settings.user.secret);
      const user = await User.getUserByEmail(email);
      if (user.passwordHash !== password) {
        throw new Error(t('user:auth.password.invalidToken'));
      }
      if (user) {
        await User.updatePassword(user.id, reset.password);
      }
    }
  }
});
