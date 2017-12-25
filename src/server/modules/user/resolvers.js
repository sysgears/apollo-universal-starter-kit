/*eslint-disable no-unused-vars*/
import { _ } from 'lodash';
import { createBatchResolver } from 'graphql-resolve-batch';

import FieldError from '../../../common/FieldError';
import { withAuth } from '../../../common/authValidation';
import { reconcileBatchOneToOne } from '../../stores/sql/knex/helpers/batching';

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
        console.log('Query.currentUser', obj, args, context.user);
        return context.User.get(context.user.id);
      } else {
        return null;
      }
    }
  },

  User: {
    id(obj) {
      return obj.userId ? obj.userId : obj.id;
    },
    profile: createBatchResolver(async (source, args, context) => {
      let ids = _.uniq(source.map(s => s.userId));
      args.ids = ids;
      const profiles = await context.User.getProfileMany(args);
      const ret = reconcileBatchOneToOne(source, profiles, 'userId');
      return ret;
    })
  },

  UserProfile: {
    displayName(obj) {
      return obj.displayName;
    },
    firstName(obj) {
      return obj.firstName;
    },
    middleName(obj) {
      return obj.middleName;
    },
    lastName(obj) {
      return obj.lastName;
    },
    title(obj) {
      return obj.title;
    },
    suffix(obj) {
      return obj.suffix;
    },
    language(obj) {
      return obj.language;
    },
    locale(obj) {
      return obj.locale;
    },
    emails(obj) {
      return obj.emails;
    }
  },

  Mutation: {
    addUser: withAuth(
      (obj, args, context) => {
        return ['user/all/create', 'user/self/create'];
        /*
        let s = context.user.id !== args.input.id ? ['user/all/create'] : ['user/self/create'];
        console.log('addUser', context.user.id, context.auth.scope, s, args);
        return s;
        */
      },
      async (obj, { input }, context) => {
        console.log('adding user:', input);
        try {
          const e = new FieldError();
          let uid = null;
          if (input.email) {
            console.log('looking for user email', input.email);
            const emailExists = await context.User.getByEmail(input.email);
            if (emailExists) {
              e.setError('email', 'E-mail already exists.');
              e.throwIf();
            }
            uid = await context.User.create({ email: input.email });
          } else {
            e.setError('email', 'E-mail address required.');
            e.throwIf();
          }

          if (!uid) {
            console.log('Error creating user', uid);
            e.setError('error', 'Something went wrong when creating the user');
            e.throwIf();
          }

          if (input.profile) {
            if (!input.profile.displayName) {
              input.profile.displayName = input.email;
            }
            console.log('creating user profile', input.profile);
            await context.User.createProfile(uid, input.profile);
          }

          const user = await context.User.get(uid);
          console.log('return user', user);
          return { user, errors: null };
        } catch (e) {
          return { user: null, errors: e };
        }
      }
    ),
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
            const emailExists = await context.User.getByEmail(input.email);
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
