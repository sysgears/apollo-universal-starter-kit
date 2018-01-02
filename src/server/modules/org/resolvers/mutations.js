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
  obj.Mutation.addOrg = authSwitch([
    {
      requiredScopes: ['org/create', 'admin:org/create'],
      callback: async (obj, { input }, context) => {
        // console.log('adding org:', input);
        try {
          const e = new FieldError();
          let oid = null;
          if (input.name) {
            const nameExists = await context.Org.getByName(input.name);
            if (nameExists) {
              e.setError('name', 'Name already exists.');
              e.throwIf();
            }
            oid = await context.Org.create({ name: input.name });
          } else {
            e.setError('name', 'Org name required.');
            e.throwIf();
          }

          if (!oid) {
            // console.log('Error creating org', oid);
            e.setError('error', 'Something went wrong when creating the org');
            e.throwIf();
          }

          if (input.profile) {
            await context.Org.createProfile(oid, input.profile);
          }
          if (input.settings) {
            await context.Org.createSettings(oid, input.settings);
          }

          const org = await context.Org.get({ id: oid });
          // console.log('return org', org);
          return { org, errors: null };
        } catch (e) {
          return { org: null, errors: e };
        }
      }
    }
  ]);

  obj.Mutation.editOrg = authSwitch([
    {
      requiredScopes: ['org/update', 'admin:org/update'],
      presentedScopes: (obj, args, context) => {
        const orgId = args.input.id;
        let org = context.auth.orgRolesAndPermissions.find(elem => elem.orgId === orgId);
        if (org) {
          const scopes = org.permissions.map(e => e.name);
          return scopes;
        }
        return context.auth.scope;
      },
      callback: async (obj, { input }, context) => {
        try {
          const e = new FieldError();
          if (input.name) {
            // console.log('updating org name');
            const nameExists = await context.Org.getByName(input.name);
            if (nameExists && nameExists.id !== input.id) {
              e.setError('name', 'Org name already exists.');
              e.throwIf();
            }
          }

          await context.Org.update(input.id, _.pick(input, ['name', 'urlName', 'displayName', 'locale']));

          if (input.profile) {
            await context.Org.updateProfile(input.id, input.profile);
          }

          if (input.settings) {
            await context.Org.updateSettings(input.id, input.settings);
          }

          const org = await context.Org.get({ id: input.id });
          // console.log('return org', org);
          return { org, errors: null };
        } catch (e) {
          return { org: null, errors: e };
        }
      }
    }
  ]);

  obj.Mutation.deleteOrg = authSwitch([
    {
      requiredScopes: ['org/delete', 'admin:org/delete'],
      presentedScopes: (obj, args, context) => {
        const orgId = args.input.id;
        let org = context.auth.orgRolesAndPermissions.find(elem => elem.orgId === orgId);
        if (org) {
          const scopes = org.permissions.map(e => e.name);
          return scopes;
        }
        return context.auth.scope;
      },
      callback: async (obj, { id }, context) => {
        try {
          const e = new FieldError();

          const org = await context.Org.get({ id });
          if (!org) {
            e.setError('delete', 'Org does not exist.');
            e.throwIf();
          }

          const isDeleted = await context.Org.delete(id);
          if (isDeleted) {
            return { org, errors: null };
          } else {
            e.setError('delete', 'Could not delete org. Please try again later.');
            e.throwIf();
          }
        } catch (e) {
          return { org: null, errors: e };
        }
      }
    }
  ]);

  obj.Mutation.addUserToOrg = authSwitch([
    {
      requiredScopes: (obj, args, context) => {
        if (args.userId == context.user.id) {
          return ['org:members:self/create'];
        }
        return ['org:members/create', 'admin:org:members/create'];
      },
      presentedScopes: (obj, args, context) => {
        const orgId = args.input.id;
        let org = context.auth.orgRolesAndPermissions.find(elem => elem.orgId === orgId);
        if (org) {
          const scopes = org.permissions.map(e => e.name);
          return scopes;
        }
        return context.auth.scope;
      },
      callback: async (obj, { orgId, userId }, context) => {
        try {
          const e = new FieldError();

          const org = await context.Org.get({ id: orgId });
          if (!org) {
            e.setError('add', 'Org does not exist.');
            e.throwIf();
          }

          const user = await context.User.get({ id: userId });
          if (!user) {
            e.setError('add', 'Org does not exist.');
            e.throwIf();
          }

          const isAdded = await context.Org.addUserToOrg(orgId, userId);
          if (isAdded) {
            return { org, errors: null };
          } else {
            e.setError('add', 'Could not add user to org. Please try again later.');
            e.throwIf();
          }
        } catch (e) {
          return { org: null, errors: e };
        }
      }
    }
  ]);

  obj.Mutation.removeUserFromOrg = authSwitch([
    {
      requiredScopes: (obj, args, context) => {
        if (args.userId == context.user.id) {
          return ['org:members:self/delete'];
        }
        return ['org:members/delete', 'admin:org:members/delete'];
      },
      presentedScopes: (obj, args, context) => {
        const orgId = args.input.id;
        let org = context.auth.orgRolesAndPermissions.find(elem => elem.orgId === orgId);
        if (org) {
          const scopes = org.permissions.map(e => e.name);
          return scopes;
        }
        return context.auth.scope;
      },
      callback: async (obj, { orgId, userId }, context) => {
        try {
          const e = new FieldError();

          const org = await context.Org.get({ id: orgId });
          if (!org) {
            e.setError('remove', 'Org does not exist.');
            e.throwIf();
          }

          const user = await context.User.get({ id: userId });
          if (!user) {
            e.setError('remove', 'Org does not exist.');
            e.throwIf();
          }

          const isRemoved = await context.Org.removeUserFromOrg(orgId, userId);
          if (isRemoved) {
            return { org, errors: null };
          } else {
            log.error('Error removing user');
            e.setError('remove', 'Could not remove user from org. Please try again later.');
            e.throwIf();
          }
        } catch (e) {
          return { org: null, errors: e };
        }
      }
    }
  ]);

  obj.Mutation.addGroupToOrg = authSwitch([
    {
      requiredScopes: (obj, args, context) => {
        return ['org.member/superuser/create', 'org.member/owner/create'];
      },
      callback: async (obj, { orgId, groupId }, context) => {
        try {
          const e = new FieldError();

          const org = await context.Org.get({ id: orgId });
          if (!org) {
            e.setError('add', 'Org does not exist.');
            e.throwIf();
          }

          const group = await context.Group.get({ id: groupId });
          if (!group) {
            e.setError('add', 'Org does not exist.');
            e.throwIf();
          }

          const isAdded = await context.Org.addGroupToOrg(orgId, groupId);
          if (isAdded) {
            return { org, errors: null };
          } else {
            e.setError('add', 'Could not add group to org. Please try again later.');
            e.throwIf();
          }
        } catch (e) {
          return { org: null, errors: e };
        }
      }
    }
  ]);

  obj.Mutation.removeGroupFromOrg = authSwitch([
    {
      requiredScopes: (obj, args, context) => {
        return ['org.member/superuser/delete', 'org.member/owner/delete'];
      },
      callback: async (obj, { orgId, groupId }, context) => {
        try {
          const e = new FieldError();

          const org = await context.Org.get({ id: orgId });
          if (!org) {
            e.setError('remove', 'Org does not exist.');
            e.throwIf();
          }

          const group = await context.Group.get({ id: groupId });
          if (!group) {
            e.setError('remove', 'Org does not exist.');
            e.throwIf();
          }

          const isRemoved = await context.Org.removeGroupFromOrg(orgId, groupId);
          if (isRemoved) {
            return { org, errors: null };
          } else {
            log.error('Error removing group');
            e.setError('remove', 'Could not remove group from org. Please try again later.');
            e.throwIf();
          }
        } catch (e) {
          return { org: null, errors: e };
        }
      }
    }
  ]);

  return obj;
}
