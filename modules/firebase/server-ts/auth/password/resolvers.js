import { pick, isEmpty } from 'lodash';
import jwt from 'jsonwebtoken';
import { UserInputError } from 'apollo-server-errors';
import access from '../../access';
import settings from '../../../../../settings';

export default () => ({
  Mutation: {
    async login(
      obj,
      {
        input: { email, errorCode, token }
      },
      { req, User }
    ) {
      let errors = {};
      if (errorCode) {
        if (errorCode === 'auth/wrong-password') {
          errors = { password: req.t('firebase:auth.password.validPassword') };
        }
        if (errorCode === 'auth/user-not-found') {
          errors = { email: req.t('firebase:auth.password.validPasswordEmail') };
        }
        if (errorCode === 'auth/too-many-requests') {
          errors = { email: req.t('firebase:auth.tooManyRequests') };
        }
      }
      const user = await User.getUserByEmail(email);
      if (user && settings.user.auth.password.confirm && !user.isActive) {
        errors = { email: req.t('firebase:auth.password.emailConfirmation') };
      }
      if (!isEmpty(errors)) throw new UserInputError(errorCode, { errors });

      await access.grantAccess(token, req);

      const { passwordHash, ...userWithoutPass } = user;

      return { userWithoutPass };
    },
    async register(obj, { input }, { User, req, mailer }) {
      const { t } = req;
      const isActive = !settings.firebase.sendConfirmationEmail.enabled;
      const { errors, id } = await User.register({ ...input, isActive });

      // Firebase errors
      if (errors && errors.code === 'auth/email-already-exists') {
        errors.email = t('firebase:auth.password.emailIsExisted');
      }
      if (errors && errors.code === 'auth/invalid-password') {
        errors.password = t('firebase:auth.password.passwordLength');
      }

      if (!isEmpty(errors)) throw new UserInputError('Failed reset password', { errors });

      const user = await User.getUser(id);

      if (mailer && settings.firebase.sendConfirmationEmail.enabled && req) {
        // async email
        jwt.sign(
          { user: pick(user, 'id') },
          settings.firebase.sendConfirmationEmail.secret,
          { expiresIn: '1d' },
          (err, emailToken) => {
            const encodedToken = Buffer.from(emailToken).toString('base64');
            const url = `${__WEBSITE_URL__}/confirmation/${encodedToken}`;
            mailer.sendMail({
              from: `${settings.app.name} <${process.env.EMAIL_USER}>`,
              to: user.email,
              subject: 'Your account has been created',
              html: `<p>Hi, ${user.username}!</p>
            <p>Welcome to ${settings.app.name}. Please click the following link to confirm your email:</p>
            <p><a href="${url}">${url}</a></p>
            <p>Below are your login information</p>
            <p>Your email is: ${user.email}</p>`
            });
          }
        );
      }

      return { user };
    },
    async forgotPassword(obj, { input }, { mailer, User }) {
      try {
        const localAuth = pick(input, 'email');
        const user = await User.getUserByEmail(localAuth.email);

        if (user && mailer) {
          // async email
          jwt.sign(
            { email: user.email, password: user.passwordHash },
            settings.user.secret,
            { expiresIn: '1d' },
            (err, emailToken) => {
              // encoded token since react router does not match dots in params
              const encodedToken = Buffer.from(emailToken).toString('base64');
              const url = `${__WEBSITE_URL__}/reset-password/${encodedToken}`;
              mailer.sendMail({
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
      let errors = {};
      const reset = pick(input, ['password', 'passwordConfirmation', 'token']);
      if (reset.password !== reset.passwordConfirmation) {
        errors.password = t('firebase:auth.password.passwordsIsNotMatch');
      }
      if (reset.password.length < settings.user.auth.password.minLength) {
        errors.password = t('firebase:auth.password.passwordLength');
      }

      if (!isEmpty(errors)) throw new UserInputError('Failed reset password', { errors });
      const token = Buffer.from(reset.token, 'base64').toString();
      const { email, password } = jwt.verify(token, settings.firebase.sendConfirmationEmail.secret);
      const user = await User.getUserByEmail(email);
      if (user.passwordHash !== password) {
        throw new Error(t('firebase:auth.password.invalidToken'));
      }
      const { id } = await User.updatePassword(user.id, reset.password);

      return id;
    }
  }
});
