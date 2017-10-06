/*eslint-disable no-unused-vars*/
import bcrypt from 'bcryptjs';
import { pick } from 'lodash';
import jwt from 'jsonwebtoken';
import url from 'url';
import { refreshTokens, tryLogin } from './auth';
import { requiresAuth, requiresAdmin } from './permissions';
import FieldError from '../../../common/FieldError';
import settings from '../../../../settings';

const { protocol, hostname, port } = url.parse(__BACKEND_URL__);
let serverPort = process.env.PORT || port;
if (__DEV__) {
  serverPort = '3000';
}

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

        if (context.mailer && settings.user.auth.password.sendConfirmationEmail && !emailExists) {
          // async email
          jwt.sign({ user: pick(user, 'id') }, context.SECRET, { expiresIn: '1d' }, (err, emailToken) => {
            const url = `${protocol}//${hostname}:${serverPort}/confirmation/${emailToken}`;
            context.mailer.sendMail({
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
    }
  },
  Subscription: {}
});
