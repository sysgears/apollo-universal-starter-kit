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
  obj.Mutation.addGroup = authSwitch([
    {
      requiredScopes: ['group/superuser/create', 'group/owner/create'],
      callback: async (obj, args, context) => {
        console.log('adding group:', args);
        try {
          const e = new FieldError();
          let gid = null;
          if (args.name) {
            const nameExists = await context.Group.getByName(args.name);
            if (nameExists) {
              e.setError('name', 'Name already exists.');
              e.throwIf();
            }
            gid = await context.Group.create({ name: args.name });
          } else {
            e.setError('name', 'Group name required.');
            e.throwIf();
          }

          if (!gid) {
            console.log('Error creating group', gid);
            e.setError('error', 'Something went wrong when creating the group');
            e.throwIf();
          }

          if (args.profile) {
            if (!args.profile.displayName) {
              args.profile.displayName = args.name;
            }
            console.log('creating group profile', args.profile);
            await context.Group.createProfile(gid, args.profile);
          }

          const group = await context.Group.get({ id: gid });
          console.log('return group', group);
          return { group, errors: null };
        } catch (e) {
          return { group: null, errors: e };
        }
      }
    }
  ]);

  obj.Mutation.editGroup = authSwitch([
    {
      requiredScopes: (obj, args, context) => {
        let isMember = context.auth.groupRoles.map(elem => elem);
        return isMember ? ['group/owner/update', 'group/admin/update'] : ['group/superuser/update'];
      },
      callback: async (obj, args, context) => {
        try {
          const e = new FieldError();
          if (args.name) {
            console.log('updating group name');
            const nameExists = await context.Group.getByName(args.name);
            if (nameExists && nameExists.id !== args.id) {
              e.setError('name', 'E-mail already exists.');
              e.throwIf();
            }
            await context.Group.update(args.id, { name: args.name });
          }

          if (args.profile) {
            console.log('updating group profile', args.profile);
            await context.Group.updateProfile(args.id, args.profile);
          }

          const group = await context.Group.get(args.id);
          console.log('return group', group);
          return { group, errors: null };
        } catch (e) {
          return { group: null, errors: e };
        }
      }
    }
  ]);

  obj.Mutation.deleteGroup = authSwitch([
    {
      requiredScopes: (obj, args, context) => {
        let isMember = context.auth.groupRoles.map(elem => elem);
        return isMember ? ['group/owner/delete'] : ['group/superuser/delete'];
      },
      callback: async (obj, args, context) => {
        try {
          const e = new FieldError();

          const group = await context.Group.get({ id: args.id });
          if (!group) {
            e.setError('delete', 'Group does not exist.');
            e.throwIf();
          }

          const isDeleted = await context.Group.delete(args.id);
          if (isDeleted) {
            return { group, errors: null };
          } else {
            e.setError('delete', 'Could not delete group. Please try again later.');
            e.throwIf();
          }
        } catch (e) {
          return { group: null, errors: e };
        }
      }
    }
  ]);

  obj.Mutation.addUserToGroup = authSwitch([
    {
      requiredScopes: (obj, args, context) => {
        let isMember = context.auth.groupRoles.map(elem => elem);
        return isMember ? ['group/owner/delete'] : ['group/superuser/delete'];
      },
      callback: async (obj, args, context) => {
        try {
          let { userId, groupId } = args;
          const e = new FieldError();

          const group = await context.Group.get(groupId);
          if (!group) {
            e.setError('add', 'Group does not exist.');
            e.throwIf();
          }

          const user = await context.User.get({ id: userId });
          if (!user) {
            e.setError('add', 'Group does not exist.');
            e.throwIf();
          }

          const isAdded = await context.Group.addUserToGroup(userId, groupId);
          if (isAdded) {
            return { group, errors: null };
          } else {
            e.setError('add', 'Could not add user to group. Please try again later.');
            e.throwIf();
          }
        } catch (e) {
          return { group: null, errors: e };
        }
      }
    }
  ]);

  obj.Mutation.removeUserFromGroup = authSwitch([
    {
      requiredScopes: (obj, args, context) => {
        if (args.userId == context.user.id) {
          return ['group:member/member/delete'];
        }
        let isMember = context.auth.groupRoles.map(elem => elem);
        return isMember ? ['group/owner/delete'] : ['group/superuser/delete'];
      },
      callback: async (obj, args, context) => {
        try {
          let { userId, groupId } = args;
          const e = new FieldError();

          const group = await context.Group.get(groupId);
          if (!group) {
            e.setError('remove', 'Group does not exist.');
            e.throwIf();
          }

          const user = await context.User.get({ id: userId });
          if (!user) {
            e.setError('remove', 'Group does not exist.');
            e.throwIf();
          }

          const isRemoved = await context.Group.removeUserFromGroup(userId, groupId);
          if (isRemoved) {
            return { user, group, errors: null };
          } else {
            log.error('Error removing user', isRemoved);
            e.setError('remove', 'Could not remove user from group. Please try again later.');
            e.throwIf();
          }
        } catch (e) {
          return { user: null, group: null, errors: e };
        }
      }
    }
  ]);

  return obj;
}
