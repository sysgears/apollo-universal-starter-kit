/*eslint-disable no-unused-vars*/
import { _ } from 'lodash';
import { createBatchResolver } from 'graphql-resolve-batch';

import log from '../../../../common/log';

import FieldError from '../../../../common/FieldError';

import { authSwitch } from '../../../../common/auth/server';

import { reconcileBatchOneToOne, reconcileBatchManyToMany } from '../../../stores/sql/knex/helpers/batching';

export default function addResolvers(obj) {
  obj = addMutations(obj);
  return obj;
}

function addMutations(obj) {
  obj.Mutation.addUser = authSwitch([
    {
      requiredScopes: ['user/superuser/create', 'user/admin/create', 'user/self/create'],
      callback: async (obj, args, context) => {
        console.log('adding user:', args);
        try {
          const e = new FieldError();
          let uid = null;
          if (args.email) {
            console.log('looking for user email', args.email);
            const emailExists = await context.User.getByEmail(args.email);
            if (emailExists) {
              e.setError('email', 'E-mail already exists.');
              e.throwIf();
            }
            uid = await context.User.create({ email: args.email });
          } else {
            e.setError('email', 'E-mail address required.');
            e.throwIf();
          }

          if (!uid) {
            console.log('Error creating user', uid);
            e.setError('error', 'Something went wrong when creating the user');
            e.throwIf();
          }

          if (args.profile) {
            if (!args.profile.displayName) {
              args.profile.displayName = args.email;
            }
            console.log('creating user profile', args.profile);
            await context.User.createProfile(uid, args.profile);
          }

          const user = await context.User.get({ id: uid });
          console.log('return user', user);
          return { user, errors: null };
        } catch (e) {
          return { user: null, errors: e };
        }
      }
    }
  ]);

  obj.Mutation.editUser = authSwitch([
    {
      requiredScopes: (obj, args, context) => {
        return context.user.id !== args.id
          ? ['user/superuser/update', 'user/admin/update', 'user/editor/update']
          : ['user/self/update'];
      },
      callback: async (obj, args, context) => {
        try {
          const e = new FieldError();
          if (args.email) {
            console.log('updating user email');
            const emailExists = await context.User.getByEmail(args.email);
            if (emailExists && emailExists.id !== args.id) {
              e.setError('email', 'E-mail already exists.');
              e.throwIf();
            }
            await context.User.update(args.id, { email: args.email });
          }

          if (args.profile) {
            console.log('updating user profile', args.profile);
            await context.User.updateProfile(args.id, args.profile);
          }

          const user = await context.User.get({ id: args.id });
          console.log('return user', user);
          return { user, errors: null };
        } catch (e) {
          return { user: null, errors: e };
        }
      }
    }
  ]);

  obj.Mutation.deleteUser = authSwitch([
    {
      requiredScopes: (obj, args, context) => {
        return context.user.id !== args.id
          ? ['user/superuser/update', 'user/admin/update', 'user/editor/update']
          : ['user/self/update'];
      },
      callback: async (obj, args, context) => {
        try {
          const e = new FieldError();

          const user = await context.User.get({ id: args.id });
          if (!user) {
            e.setError('delete', 'User does not exist.');
            e.throwIf();
          }

          const isDeleted = await context.User.delete(args.id);
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
    }
  ]);

  return obj;
}
