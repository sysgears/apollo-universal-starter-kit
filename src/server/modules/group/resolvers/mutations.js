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
      // if not in group, fallback to user scopes, what about org scopes?
      // org scopes will be for groups that are part of orgs
      // with seperate add/delete group functions
      requiredScopes: ['group/create', 'admin:group/create'],
      callback: async (obj, args, context) => {
        let { input } = args;
        // console.log('adding group:', input);
        try {
          const e = new FieldError();
          let gid = null;
          if (input.name) {
            const nameExists = await context.Group.getByName(input.name);
            if (nameExists) {
              e.setError('name', 'Name already exists.');
              e.throwIf();
            }
            gid = await context.Group.create({ name: input.name });
          } else {
            e.setError('name', 'Group name required.');
            e.throwIf();
          }

          if (!gid) {
            // console.log('Error creating group', gid);
            e.setError('error', 'Something went wrong when creating the group');
            e.throwIf();
          }

          if (input.profile) {
            await context.Group.createProfile(gid, input.profile);
          }

          if (input.settings) {
            await context.Group.createSettings(gid, input.settings);
          }

          const group = await context.Group.get({ id: gid });
          // console.log('return group', group);
          return { group, errors: null };
        } catch (e) {
          return { group: null, errors: e };
        }
      }
    }
  ]);

  obj.Mutation.editGroup = authSwitch([
    {
      requiredScopes: ['group/update', 'admin:group/update'],
      presentedScopes: (obj, args, context) => {
        const groupId = args.input.id;
        let group = context.auth.groupRolesAndPermissions.find(elem => elem.groupId === groupId);
        if (group) {
          const scopes = group.permissions.map(e => e.name);
          return scopes;
        }
        // if not in group, fallback to user scopes, what about org scopes?
        return context.auth.userScopes;
      },
      callback: async (obj, args, context) => {
        let { input } = args;
        try {
          const e = new FieldError();
          if (input.name) {
            const nameExists = await context.Group.getByName(input.name);
            if (nameExists && nameExists.id !== input.id) {
              e.setError('name', 'Group name already exists.');
              e.throwIf();
            }
          }

          /*
          if (input.urlName) {
            console.log('updating group urlName');
          ?? const nameExists = await context.Group.getByName(input.name);
            if (nameExists && nameExists.id !== input.id) {
              e.setError('name', 'Group name already exists.');
              e.throwIf();
            }
          }
          */

          await context.Group.update(input.id, _.pick(input, ['name', 'urlName', 'displayName', 'locale']));

          if (input.profile) {
            await context.Group.updateProfile(input.id, input.profile);
          }

          if (input.settings) {
            await context.Group.updateSettings(input.id, input.settings);
          }

          const group = await context.Group.get({ id: input.id });
          return { group, errors: null };
        } catch (e) {
          return { group: null, errors: e };
        }
      }
    }
  ]);

  obj.Mutation.deleteGroup = authSwitch([
    {
      requiredScopes: ['group/delete', 'admin:group/delete'],
      presentedScopes: (obj, args, context) => {
        const groupId = args.input.id;
        let group = context.auth.groupRolesAndPermissions.find(elem => elem.groupId === groupId);
        if (group) {
          const scopes = group.permissions.map(e => e.name);
          return scopes;
        }
        // if not in group, fallback to user scopes, what about org scopes?
        return context.auth.userScopes;
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
        // need to check group settings here too
        // because this mutation could be used in a variety of contexts in the client.
        if (args.userId == context.user.id) {
          return ['group:members:self/create'];
        }
        return ['group:members/create', 'admin:group:members/create'];
      },
      presentedScopes: (obj, args, context) => {
        const groupId = args.input.id;
        let group = context.auth.groupRolesAndPermissions.find(elem => elem.groupId === groupId);
        if (group) {
          const scopes = group.permissions.map(e => e.name);
          return scopes;
        }
        // if not in group, fallback to user scopes, what about org scopes?
        return context.auth.userScopes;
      },
      callback: async (obj, args, context) => {
        try {
          let { userId, groupId } = args;
          const e = new FieldError();

          const group = await context.Group.get({ id: groupId });
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
          return ['group:members:self/delete'];
        }
        return ['group:members/delete', 'admin:group:members/delete'];
      },
      presentedScopes: (obj, args, context) => {
        const groupId = args.input.id;
        let group = context.auth.groupRolesAndPermissions.find(elem => elem.groupId === groupId);
        if (group) {
          const scopes = group.permissions.map(e => e.name);
          return scopes;
        }
        // if not in group, fallback to user scopes, what about org scopes?
        return context.auth.userScopes;
      },
      callback: async (obj, args, context) => {
        try {
          let { userId, groupId } = args;
          const e = new FieldError();

          const group = await context.Group.get({ id: groupId });
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
