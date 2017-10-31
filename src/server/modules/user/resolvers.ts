/*eslint-disable no-unused-vars*/
import * as bcrypt from 'bcryptjs';
import { PubSub } from 'graphql-subscriptions';
import * as jwt from 'jsonwebtoken';
import { pick } from 'lodash';
import settings from '../../../../settings';
import FieldError from '../../../common/FieldError';
import { refreshTokens, tryLogin } from './auth';
import { requiresAdmin, requiresAuth } from './permissions';

export interface AuthInput {
  email?: string;
  password?: string;
}

export interface UserParams {
  id?: number;
  newPassword?: string;
  token?: string;
  refreshToken?: string;
  input?: AuthInput;
}

export default (pubsub: PubSub) => ({
  Query: {
    users: requiresAdmin.createResolver((obj: any, args: UserParams, context: any) => {
      return context.User.getUsers();
    }),
    user: requiresAuth.createResolver((obj: any, args: UserParams, context: any) => {
      return context.User.getUser(args.id);
    }),
    currentUser(obj: any, args: UserParams, context: any) {
      if (context.user) {
        return context.User.getUser(context.user.id);
      } else {
        return null;
      }
    }
  },
  Mutation: {
    async register(obj: any, args: UserParams, context: any) {
      try {
        const e = new FieldError();
        const localAuth = { email: args.input.email, password: args.input.password };
        const emailExists = await context.User.getLocalOuthByEmail(localAuth.email);

        if (emailExists && emailExists.password) {
          e.setError('email', 'E-mail already exists.');
          e.throwIf();
        }

        let userId = 0;
        if (emailExists === null) {
          const passwordPromise = bcrypt.hash(localAuth.password, 12);

          let isActive = false;
          if (!settings.user.auth.password.confirm) {
            isActive = true;
          }

          const createUserPromise = context.User.register({ ...args.input, isActive });
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
    async login(obj: any, args: UserParams, context: any) {
      try {
        const tokens = await tryLogin(args.input.email, args.input.password, context.User, context.SECRET);
        if (context.req && context.req.universalCookies) {
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
    async logout(obj: any, args: UserParams, context: any) {
      if (context.req && context.req.universalCookies) {
        context.req.universalCookies.remove('x-token');
        context.req.universalCookies.remove('x-refresh-token');

        context.req.universalCookies.remove('r-token');
        context.req.universalCookies.remove('r-refresh-token');
      }

      return true;
    },
    async updatePassword(obj: any, args: UserParams, context: any) {
      try {
        const password = await bcrypt.hash(args.newPassword, 12);
        await context.User.UpdatePassword(args.id, password);
        return true;
      } catch (e) {
        return false;
      }
    },
    refreshTokens(obj: any, args: UserParams, context: any) {
      return refreshTokens(args.token, args.refreshToken, context.User, context.SECRET);
    }
  },
  Subscription: {}
});
