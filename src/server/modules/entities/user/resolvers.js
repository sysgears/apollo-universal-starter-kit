/*eslint-disable no-unused-vars*/
import { _ } from 'lodash';
import { createBatchResolver } from 'graphql-resolve-batch';

import FieldError from '../../../../common/FieldError';
import { withAuth } from '../../../../common/authValidation';
import { reconcileBatchOneToOne } from '../../../sql/helpers';

export default pubsub => ({
  Query: {
    users: withAuth(['user/all/view'], async (obj, args, context) => {
      return context.User.list(args);
    }),
    user: withAuth(
      (obj, args, context) => {
        return context.user.id !== args.id ? ['user/all/view'] : ['user/self/view'];
      },
      (obj, args, context) => {
        let { id } = args;
        return context.User.get(id);
      }
    ),
    currentUser: (obj, args, context) => {
      if (context.user) {
        return context.User.get(context.user.id);
      } else {
        return null;
      }
    }
  },

  User: {
    id(obj) {
      return obj.userId;
    },
    profile: createBatchResolver(async (source, args, context) => {
      let ids = _.uniq(source.map(s => s.userId));
      const profiles = await context.User.getProfileMany(ids);
      const ret = reconcileBatchOneToOne(source, profiles, 'userId');
      return ret;
    })
  },

  Mutation: {
    addUser: async (obj, args, context) => {
      try {
        const e = new FieldError();
        let user;

        return { user, errors: null };
      } catch (e) {
        return { user: null, errors: e };
      }
    },
    editUser: withAuth(
      (obj, args, context) => {
        let s = context.user.id !== args.input.id ? ['user/all/update'] : ['user/self/update'];
        console.log('editUser', context.user.id, context.auth.scope, s, args);
        return s;
      },
      async (obj, { input }, context) => {
        try {
          const e = new FieldError();
          if (input.email) {
            console.log('updating user email');
            const emailExists = await context.User.getUserByEmail(input.email);
            if (emailExists && emailExists.id !== input.id) {
              e.setError('email', 'E-mail already exists.');
              e.throwIf();
            }
            await context.User.update(input.id, { email: input.email });
          }

          if (input.profile) {
            console.log('updating user profile', input.profile);
            await context.User.updateProfile(input.id, input.profile);
          }

          const user = await context.User.get(input.id);
          console.log('return user', user);
          return { user, errors: null };
        } catch (e) {
          return { user: null, errors: e };
        }
      }
    ),
    deleteUser: withAuth(
      (obj, args, context) => {
        return context.user.id !== args.id ? ['user/all/delete'] : ['user/self/delete'];
      },
      async (obj, { id }, context) => {
        try {
          const e = new FieldError();

          const user = await context.User.get(id);
          if (!user) {
            e.setError('delete', 'User does not exist.');
            e.throwIf();
          }

          const isDeleted = await context.User.delete(id);
          if (isDeleted) {
            return { user, errors: null };
          } else {
            e.setError('delete', 'Could not delete user. Please try again later.');
            e.throwIf();
          }
        } catch (e) {
          return { user: null, errors: e };
        }
      }
    )
  },
  Subscription: {}
});
