/*eslint-disable no-unused-vars*/
import { _ } from 'lodash';
import { createBatchResolver } from 'graphql-resolve-batch';

import { authSwitch } from '../../../../common/auth/server';
import FieldError from '../../../../common/FieldError';

import {
  reconcileBatchOneToOne,
  reconcileBatchOneToMany,
  reconcileBatchManyToMany
} from '../../../stores/sql/knex/helpers/batching';

import settings from '../../../../../settings';

export default function addResolvers(obj) {
  obj = addTypeResolvers(obj);
  obj = addQueries(obj);
  obj = addMutations(obj);
  return obj;
}

function addTypeResolvers(obj) {
  obj.OrgRoleInfo = {
    org: createBatchResolver(async (source, args, context) => {
      let oids = _.uniq(source.map(s => s.orgId));
      args.ids = oids;
      let orgs = await context.Org.getMany(args);
      const ret = reconcileBatchOneToOne(source, orgs, 'orgId');
      return ret;
    }),
    orgId(obj) {
      return obj.orgId ? obj.orgId : obj.id;
    },
    orgName(obj) {
      return obj.orgName ? obj.orgName : obj.name;
    },
    roleId(obj) {
      return obj.id;
    },
    roleName(obj) {
      return obj.name;
    },
    name(obj) {
      return obj.name;
    },
    displayName(obj) {
      return obj.displayName;
    },
    description(obj) {
      return obj.description;
    },
    scopes(obj) {
      return obj.scopes ? obj.scopes : null;
    },
    permissions: createBatchResolver(async (source, args, context) => {
      let ids = _.uniq(source.map(s => s.id));
      const rolePerms = await context.Authz.getPermissionsForOrgRoles({ ids });

      const pids = _.uniq(_.map(_.flatten(rolePerms), elem => elem.permissionId));
      args.ids = pids;
      const perms = await context.Authz.getPermissions(args);

      const ret = reconcileBatchManyToMany(source, rolePerms, perms, 'roleId', 'permissionId');
      return ret;
    }),
    users: createBatchResolver(async (source, args, context) => {
      let ids = _.uniq(source.map(s => s.id));
      const roleUsers = await context.Authz.getUsersForOrgRoles({ ids });

      const uids = _.uniq(_.map(_.flatten(roleUsers), elem => elem.userId));
      args.ids = uids;
      const users = await context.User.getMany(args);

      const ret = reconcileBatchManyToMany(source, roleUsers, users, 'roleId', 'userId');
      return ret;
    })
  };

  obj.Org = {
    roles: createBatchResolver(async (source, args, context) => {
      let ids = _.uniq(source.map(s => s.orgId));
      args.ids = ids;
      const roles = await context.Authz.getOrgRolesForOrgs(args);
      const ret = reconcileBatchOneToMany(source, roles, 'orgId');
      return ret;
    })
  };

  obj.User.orgRoles = createBatchResolver(async (source, args, context, info) => {
    let path = info.path;
    let matchFilter = null;
    let resultFilter = null;
    let selectOverrides = null;
    let joins = [];
    let filters = [];
    while (path) {
      /*
      if (path.key === 'orgs') {
        let oids = _.uniq(source.map(s => s.orgId));

        joins.push({
          table: 'orgs_groups',
          join: 'left',
          args: ['orgs_groups.group_id', 'group_roles.group_id']
        })
        filters.push({
          bool: 'and',
          table: 'orgs_groups',
          field: 'org_id',
          compare: 'in',
          values: oids
        })

        selectOverrides = ['group_roles.*', 'orgs_groups.group_id', 'orgs_groups.org_id', 'group_roles.id AS role_id']

        resultFilter = 'orgId'
        break
      }
      */
      if (path.key === 'orgs' || path.key === 'org') {
        resultFilter = 'orgId';
        break;
      }
      path = path.prev;
    }
    let ids = _.uniq(source.map(s => s.userId));
    const userRoles = await context.Authz.getOrgRolesForUsers({ ids });

    const rids = _.uniq(_.map(_.flatten(userRoles), elem => elem.roleId));
    args.ids = rids;
    const roles = await context.Authz.getOrgRoles(args);

    const ret = reconcileBatchManyToMany(source, userRoles, roles, 'userId', 'roleId', matchFilter, resultFilter);
    return ret;
  });

  return obj;
}

function addQueries(obj) {
  obj.Query.orgRoles = async function(obj, args, context) {
    return context.Authz.getOrgRoles(args);
  };

  obj.Query.orgRole = async function(obj, args, context) {
    return context.Authz.getOrgRole(args);
  };

  return obj;
}

function addMutations(obj) {
  obj.Mutation.createOrgRole = authSwitch([
    {
      requiredScopes: ['org:iam/superuser/create'],
      callback: async function(obj, args, context) {
        return context.Authz.createOrgRole(args.input);
      }
    }
  ]);

  obj.Mutation.updateOrgRole = authSwitch([
    {
      requiredScopes: ['org:iam/superuser/update'],
      callback: async function(obj, args, context) {
        return context.authz.updateorgrole(args.id, args.input);
      }
    }
  ]);

  obj.Mutation.deleteOrgRole = authSwitch([
    {
      requiredScopes: ['org:iam/superuser/delete'],
      callback: async function(obj, args, context) {
        return context.Authz.deleteOrgRole(args.id);
      }
    }
  ]);

  obj.Mutation.grantPermissionToOrgRole = authSwitch([
    {
      requiredScopes: ['org:iam/superuser/update'],
      callback: async function(obj, args, context) {
        try {
          let ret = await context.Authz.grantPermissionToOrgRole(args.permissionId, args.roleId);
          if (!ret) {
            return {
              permission: null,
              role: null,
              errors: [{ field: 'general', message: 'something went wrong, please try again later' }]
            };
          } else {
            let role = await context.Authz.getOrgRole({ id: args.roleId });
            let permission = await context.Authz.getPermission({ id: args.permissionId });
            return { permission, role, errors: null };
          }
        } catch (e) {
          return { permission: null, role: null, errors: [e] };
        }
      }
    }
  ]);

  obj.Mutation.revokePermissionFromOrgRole = authSwitch([
    {
      requiredScopes: ['org:iam/superuser/update'],
      callback: async function(obj, args, context) {
        try {
          let ret = await context.Authz.revokePermissionFromOrgRole(args.permissionId, args.roleId);
          if (!ret) {
            return {
              permission: null,
              role: null,
              errors: [{ field: 'general', message: 'something went wrong, please try again later' }]
            };
          } else {
            let role = await context.Authz.getOrgRole({ id: args.roleId });
            let permission = await context.Authz.getPermission({ id: args.permissionId });
            return { permission, role, errors: null };
          }
        } catch (e) {
          return { permission: null, role: null, errors: [e] };
        }
      }
    }
  ]);

  obj.Mutation.grantOrgRoleToUser = authSwitch([
    {
      requiredScopes: ['org:iam/superuser/update'],
      callback: async function(obj, args, context) {
        try {
          let ret = await context.Authz.grantOrgRoleToUser(args.roleId, args.userId);
          if (!ret) {
            return {
              user: null,
              role: null,
              errors: [{ field: 'general', message: 'something went wrong, please try again later' }]
            };
          } else {
            let role = await context.Authz.getOrgRole({ id: args.roleId });
            let user = await context.User.get({ id: args.userId });
            return { user, role, errors: null };
          }
        } catch (e) {
          return { user: null, role: null, errors: [e] };
        }
      }
    }
  ]);

  obj.Mutation.revokeOrgRoleFromUser = authSwitch([
    {
      requiredScopes: ['org:iam/superuser/update'],
      callback: async function(obj, args, context) {
        try {
          let ret = await context.Authz.revokeOrgRoleFromUser(args.roleId, args.userId);
          if (!ret) {
            return {
              user: null,
              role: null,
              errors: [{ field: 'general', message: 'something went wrong, please try again later' }]
            };
          } else {
            let role = await context.Authz.getOrgRole({ id: args.roleId });
            let user = await context.User.get({ id: args.userId });
            return { user, role, errors: null };
          }
        } catch (e) {
          return { user: null, role: null, errors: [e] };
        }
      }
    }
  ]);

  return obj;
}
