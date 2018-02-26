/*eslint-disable no-unused-vars*/
import { pick } from 'lodash';
import jwt from 'jsonwebtoken';
import withAuth from 'graphql-auth';
import { tryLogin, updateSession } from './auth';
import FieldError from '../../../../../../common/FieldError';
import settings from '../../../../../../../settings';

export default pubsub => ({
  Query: {
    users: withAuth(['user:view:all'], (obj, { orderBy, filter }, context) => {
      return context.User.getUsers(orderBy, filter);
    }),
    user: withAuth(
      (obj, args, context) => {
        return context.user.id !== args.id ? ['user:view'] : ['user:view:self'];
      },
      (obj, { id }, context) => {
        return context.User.getUser(id);
      }
    ),
    currentUser(obj, args, context) {
      if (context.user) {
        return context.User.getUser(context.user.id);
      } else {
        return null;
      }
    }
  },
  Mutation: {
    async login(obj, { input: { email, password } }, context) {
      try {
        const data = await tryLogin(email, password, context);
        const session = {
          ...context.req.session,
          userId: data.user.id
        };
        context.req.session = updateSession(context.req, session);

        return data;
      } catch (e) {
        return { errors: e };
      }
    },
    async logout(obj, args, context) {
      if (context.req) {
        context.req.universalCookies.remove('session');
      }

      const session = { ...context.req.session };
      delete session.userId;
      context.req.session = updateSession(context.req, session);

      return true;
    }
  }
});
