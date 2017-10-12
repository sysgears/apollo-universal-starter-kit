/*eslint-disable no-unused-vars*/
import bcrypt from 'bcryptjs';
import { pick } from 'lodash';
import jwt from 'jsonwebtoken';
import { refreshTokens, tryLogin } from './auth';
import { requiresAuth, requiresAdmin } from './permissions';
import FieldError from '../../../common/FieldError';
import settings from '../../../../settings';

export default pubsub => ({
  Query: {
    users: requiresAdmin.createResolver((obj, args, context) => {
      return context.User.getUsers();
    }),
    user: requiresAuth.createResolver((obj, { id }, context) => {
      return context.User.getUser(id);
    }),
    currentUser(obj, args, context) {
      if (context.user) {
        return context.User.getUser(context.user.id);
      } else {
        return null;
      }
    }
  },
  Mutation: {
    async register(obj, { input }, context) {
      try {
        const e = new FieldError();
        const localAuth = pick(input, ['email', 'password']);
        const emailExists = await context.User.getLocalOuthByEmail(localAuth.email);

        if (emailExists && emailExists.password) {
          e.setError('email', 'E-mail already exists.');
          e.throwIf();
        }

        let userId = 0;
        if (!emailExists) {
          const passwordPromise = bcrypt.hash(localAuth.password, 12);

          let isActive = false;
          if (!settings.user.auth.password.confirm) {
            isActive = true;
          }

          const createUserPromise = context.User.register({ ...input, isActive });
          const [password, [createdUserId]] = await Promise.all([passwordPromise, createUserPromise]);

          localAuth.password = password;

          await context.User.createLocalOuth({
            ...localAuth,
            userId: createdUserId
          });
          userId = createdUserId;

          // if user has previously logged with facebook auth
        } else {
          const password = await bcrypt.hash(localAuth.password, 12);
          await context.User.updatePassword(emailExists.userId, password);
          userId = emailExists.userId;
        }

        const user = await context.User.getUser(userId);

        if (context.mailer && settings.user.auth.password.sendConfirmationEmail && !emailExists && context.req) {
          // async email
          jwt.sign({ user: pick(user, 'id') }, context.SECRET, { expiresIn: '1d' }, (err, emailToken) => {
            const url = `${context.req.protocol}://${context.req.get('host')}/confirmation/${emailToken}`;
            context.mailer.sendMail({
              from: 'Apollo Universal Starter Kit <nxau5pr4uc2jtb6u@ethereal.email>',
              to: localAuth.email,
              subject: 'Confirm Email',
              html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`
            });
          });
        }

        return { user };
      } catch (e) {
        return { errors: e };
      }
    },
    async login(obj, { input: { email, password } }, context) {
      try {
        const tokens = await tryLogin(email, password, context.User, context.SECRET);
        if (context.req) {
          context.req.universalCookies.set('x-token', tokens.token, {
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: true
          });
          context.req.universalCookies.set('x-refresh-token', tokens.refreshToken, {
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: true
          });

          context.req.universalCookies.set('r-token', tokens.token, {
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: false
          });
          context.req.universalCookies.set('r-refresh-token', tokens.refreshToken, {
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: false
          });
        }
        return { tokens };
      } catch (e) {
        return { errors: e };
      }
    },
    async logout(obj, args, context) {
      if (context.req) {
        context.req.universalCookies.remove('x-token');
        context.req.universalCookies.remove('x-refresh-token');

        context.req.universalCookies.remove('r-token');
        context.req.universalCookies.remove('r-refresh-token');
      }

      return true;
    },
    async updatePassword(obj, { id, newPassword }, context) {
      try {
        const password = await bcrypt.hash(newPassword, 12);
        await context.User.updatePassword(id, password);
        return true;
      } catch (e) {
        return false;
      }
    },
    refreshTokens(obj, { token, refreshToken }, context) {
      return refreshTokens(token, refreshToken, context.User, context.SECRET);
    },
    async forgotPassword(obj, { input }, context) {
      try {
        const localAuth = pick(input, ['email']);
        const emailExists = await context.User.getLocalOuthByEmail(localAuth.email);

        if (emailExists && context.mailer) {
          // async email
          jwt.sign({ email: localAuth.email }, context.SECRET, { expiresIn: '1d' }, (err, emailToken) => {
            // encoded token since react router does not match dots in params
            const encodedToken = Buffer.from(emailToken).toString('base64');
            const url = `${context.req.protocol}://${context.req.get('host')}/reset-password/${encodedToken}`;
            context.mailer.sendMail({
              from: 'Apollo Universal Starter Kit <nxau5pr4uc2jtb6u@ethereal.email>',
              to: localAuth.email,
              subject: 'Reset Password',
              html: `Please click this link to reset your password: <a href="${url}">${url}</a>`
            });
          });
        }
        return true;
      } catch (e) {
        // always return true so you can't discover users this way
        return true;
      }
    }
  },
  Subscription: {}
});
