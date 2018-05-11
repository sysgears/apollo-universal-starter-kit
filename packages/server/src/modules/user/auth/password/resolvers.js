import bcrypt from 'bcryptjs';
import { pick } from 'lodash';
import jwt from 'jsonwebtoken';

import access from '../../access';
import UserDAO from '../../sql';
import FieldError from '../../../../../../common/FieldError';
import settings from '../../../../../../../settings';

const User = new UserDAO();

const validateUserPassword = async (user, password) => {
  const e = new FieldError();

  if (!user) {
    // user with provided email not found
    e.setError('usernameOrEmail', 'Please enter a valid username or e-mail.');
    e.throwIf();
  }
  if (settings.user.auth.password.confirm && !user.isActive) {
    e.setError('usernameOrEmail', 'Please confirm your e-mail first.');
    e.throwIf();
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    // bad password
    e.setError('password', 'Please enter a valid password.');
    e.throwIf();
  }
};

export default () => ({
  Mutation: {
    async login(
      obj,
      {
        input: { usernameOrEmail, password }
      },
      { req }
    ) {
      try {
        const user = await User.getUserByUsernameOrEmail(usernameOrEmail);

        await validateUserPassword(user, password);

        const tokens = await access.grantAccess(user, req);

        return { user, tokens };
      } catch (e) {
        return { errors: e };
      }
    },
    async register(obj, { input }, context) {
      try {
        const e = new FieldError();

        const userExists = await context.User.getUserByUsername(input.username);
        if (userExists) {
          e.setError('username', 'Username already exists.');
        }

        const emailExists = await context.User.getUserByEmail(input.email);
        if (emailExists) {
          e.setError('email', 'E-mail already exists.');
        }

        e.throwIf();

        let userId = 0;
        if (!emailExists) {
          let isActive = false;
          if (!settings.user.auth.password.confirm) {
            isActive = true;
          }

          [userId] = await context.User.register({ ...input, isActive });

          // if user has previously logged with facebook auth
        } else {
          await context.User.updatePassword(emailExists.userId, input.password);
          userId = emailExists.userId;
        }

        const user = await context.User.getUser(userId);

        if (context.mailer && settings.user.auth.password.sendConfirmationEmail && !emailExists && context.req) {
          // async email
          jwt.sign({ user: pick(user, 'id') }, settings.user.secret, { expiresIn: '1d' }, (err, emailToken) => {
            const encodedToken = Buffer.from(emailToken).toString('base64');
            const url = `${__WEBSITE_URL__}/confirmation/${encodedToken}`;
            context.mailer.sendMail({
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
      } catch (e) {
        return { errors: e };
      }
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
    async resetPassword(obj, { input }, context) {
      try {
        const e = new FieldError();
        const reset = pick(input, ['password', 'passwordConfirmation', 'token']);
        if (reset.password !== reset.passwordConfirmation) {
          e.setError('password', 'Passwords do not match.');
        }

        if (reset.password.length < 8) {
          e.setError('password', `Password must be 8 characters or more.`);
        }
        e.throwIf();

        const token = Buffer.from(reset.token, 'base64').toString();
        const { email, password } = jwt.verify(token, settings.user.secret);
        const user = await context.User.getUserByEmail(email);
        if (user.passwordHash !== password) {
          e.setError('token', 'Invalid token');
          e.throwIf();
        }

        if (user) {
          await context.User.updatePassword(user.id, reset.password);
        }
        return { errors: null };
      } catch (e) {
        return { errors: e };
      }
    }
  }
});
