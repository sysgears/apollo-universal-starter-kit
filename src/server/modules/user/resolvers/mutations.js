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
      requiredScopes: ['user:self/create', 'admin:user/create'],
      callback: async (obj, args, context) => {
        let { input } = args;
        // console.log('adding user:', input);
        try {
          const e = new FieldError();
          let uid = null;
          if (input.email) {
            // console.log('looking for user email', input.email);
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
            // console.log('Error creating user', uid);
            e.setError('error', 'Something went wrong when creating the user');
            e.throwIf();
          }

          if (input.profile) {
            if (!input.profile.displayName) {
              input.profile.displayName = input.email;
            }
            // console.log('creating user profile', input.profile);
            await context.User.createProfile(uid, input.profile);
          }

          const user = await context.User.get({ id: uid });
          // console.log('return user', user);
          return { user, errors: null };
        } catch (e) {
          return { user: null, errors: e };
        }
      }
    }
  ]);

  obj.Mutation.editUser = authSwitch([
    {
      requiredScopes: ['user:self/update', 'admin:user/update'],
      callback: async (obj, args, context) => {
        let { input } = args;
        try {
          const e = new FieldError();
          if (input.email) {
            const emailExists = await context.User.getByEmail(input.email);
            if (emailExists && emailExists.id !== input.id) {
              e.setError('email', 'E-mail already exists.');
              e.throwIf();
            }
            await context.User.update(input.id, { email: input.email });
          }

          if (input.profile) {
            await context.User.updateProfile(input.id, input.profile);
          }

          const user = await context.User.get({ id: input.id });
          // console.log('return user', user);
          return { user, errors: null };
        } catch (e) {
          return { user: null, errors: e };
        }
      }
    }
  ]);

  obj.Mutation.deleteUser = authSwitch([
    {
      requiredScopes: ['user:self/delete', 'admin:user/delete'],
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
