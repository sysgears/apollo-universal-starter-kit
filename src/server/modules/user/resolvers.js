/*eslint-disable no-unused-vars*/
import { pick } from 'lodash';
import jwt from 'jsonwebtoken';
import { refreshTokens, tryLogin } from './auth';
import { requiresAuth, requiresAdmin } from './permissions';
import FieldError from '../../../common/FieldError';
import settings from '../../../../settings';

export default pubsub => ({
  Query: {
    users: requiresAdmin.createResolver((obj, { orderBy, filter }, context) => {
      return context.User.getUsers(orderBy, filter);
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
          let isActive = false;
          if (!settings.user.auth.password.confirm) {
            isActive = true;
          }

          const [createdUserId] = await context.User.register({ ...input, isActive });

          await context.User.createLocalOuth({
            ...localAuth,
            userId: createdUserId
          });
          userId = createdUserId;

          // if user has previously logged with facebook auth
        } else {
          await context.User.updatePassword(emailExists.userId, localAuth.password);
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
    refreshTokens(obj, { token, refreshToken }, context) {
      return refreshTokens(token, refreshToken, context.User, context.SECRET);
    },
    addUser: requiresAdmin.createResolver(async (obj, { input }, context) => {
      try {
        const localAuth = pick(input, ['email', 'password']);
        const [createdUserId] = await context.User.register({ ...input });

        await context.User.createLocalOuth({
          ...localAuth,
          userId: createdUserId
        });

        const user = await context.User.getUser(createdUserId);

        return { user };
      } catch (e) {
        return { errors: e };
      }
    }),
    editUser: requiresAdmin.createResolver(async (obj, { input }, context) => {
      try {
        await context.User.editUser(input);
        const user = await context.User.getUser(input.id);
        return { user };
      } catch (e) {
        return { errors: e };
      }
    }),
    deleteUser: requiresAdmin.createResolver(async (obj, { id }, context) => {
      const e = new FieldError();
      try {
        const user = await context.User.getUser(id);
        if (!user) {
          e.setError('delete', 'User does not exist.');
          e.throwIf();
        }

        if (user.id === context.user.id) {
          e.setError('delete', 'You can not delete your self.');
          e.throwIf();
        }

        const isDeleted = await context.User.deleteUser(id);
        if (isDeleted) {
          return { user };
        } else {
          e.setError('delete', 'Could not delete user. Please try again later.');
          e.throwIf();
        }
      } catch (e) {
        return { errors: e };
      }
    }),
    async updatePassword(obj, { id, newPassword }, context) {
      try {
        return context.User.updatePassword(id, newPassword);
      } catch (e) {
        return false;
      }
    }
  },
  Subscription: {}
});
