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
  obj.GroupRoleInfo = {
    groupId(obj) {
      return obj.groupId ? obj.groupId : null;
    },
    groupName(obj) {
      return obj.groupName ? obj.groupName : null;
    },
    roleId(obj) {
      return obj.roleId ? obj.roleId : obj.id;
    },
    roleName(obj) {
      return obj.roleName ? obj.roleName : obj.name;
    },
    id(obj) {
      return obj.roleId ? obj.roleId : obj.id;
    },
    name(obj) {
      return obj.roleName ? obj.roleName : obj.name;
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

    group: createBatchResolver(async (sources, args, context) => {
      console.log('GroupRoleInfo.group - inputs', sources, args);

      let gids = _.uniq(sources.map(s => s.groupId));
      args.ids = gids;
      let groups = await context.Group.getMany(args);
      console.log('GroupRoleInfo.group - groups', groups);

      const ret = reconcileBatchOneToOne(sources, groups, 'groupId');
      console.log('GroupRoleInfo.group - ret', ret);
      return ret;
    }),

    permissions: createBatchResolver(async (sources, args, context) => {
      let ids = _.uniq(sources.map(s => s.id));
      const rolePerms = await context.Authz.getPermissionsForGroupRoles({ ids });

      const pids = _.uniq(_.map(_.flatten(rolePerms), elem => elem.permissionId));
      args.ids = pids;
      const perms = await context.Authz.getPermissions(args);

      const ret = reconcileBatchManyToMany(sources, rolePerms, perms, 'roleId', 'permissionId');
      return ret;
    }),
    users: createBatchResolver(async (sources, args, context) => {
      let ids = _.uniq(sources.map(s => s.id));
      const roleUsers = await context.Authz.getUsersForGroupRoles({ ids });

      const uids = _.uniq(_.map(_.flatten(roleUsers), elem => elem.userId));
      args.ids = uids;
      const users = await context.User.getMany(args);

      const ret = reconcileBatchManyToMany(sources, roleUsers, users, 'roleId', 'userId');
      return ret;
    })
  };

  obj.Group = {
    roles: createBatchResolver(async (sources, args, context) => {
      let ids = _.uniq(sources.map(s => s.groupId));
      args.ids = ids;
      const roles = await context.Authz.getGroupRolesForGroups(args);
      const ret = reconcileBatchOneToMany(sources, roles, 'groupId');
      return ret;
    }),

    myRoles: createBatchResolver(async (sources, args, context) => {
      console.log('Group.myRoles - input', sources, args, context.user);
      let ids = _.uniq(sources.map(s => s.groupId));

      let groupRoles = context.auth.groupRolesAndPermissions.filter(elem => ids.includes(elem.groupId));
      console.log('Group.myRoles - groupRoles 1', groupRoles);
      groupRoles = groupRoles.map(elem => {
        let ret = [];
        for (let role of elem.roles) {
          ret.push({
            groupId: elem.groupId,
            groupName: elem.groupName,
            roleId: role.roleId,
            roleName: role.roleName,
            permissions: role.permissions
          });
        }
        return ret;
      });

      console.log('Group.myRoles - groupRoles 2', groupRoles);

      const ret = reconcileBatchOneToMany(sources, groupRoles, 'groupId');
      return ret;
    }),

    myPermissions: createBatchResolver(async (sources, args, context) => {
      console.log('Group.myPermissions - input', sources, args, context.user);
      let ids = _.uniq(sources.map(s => s.groupId));

      let groupRoles = context.auth.groupRolesAndPermissions.filter(elem => ids.includes(elem.groupId));
      console.log('Group.myPermissions - groupRoles', groupRoles);
      let groupPermissions = groupRoles.map(elem => {
        let ret = [];
        for (let role of elem.roles) {
          ret.push(role.permissions);
        }
        return ret;
      });

      console.log('Group.myPermissions - groupPermissions', groupPermissions);

      const ret = reconcileBatchOneToMany(sources, groupPermissions, 'groupId');
      return ret;
    })
  };

  const currResolver = obj.User.roles;
  obj.User.roles = async (sources, args, context, info) => {
    console.log('User.roles - group handler');
    let localObj = obj;
    let path = [];
    let ipath = info.path;
    while (ipath) {
      path.push(ipath.key);
      ipath = ipath.prev;
    }
    console.log('Group.users.roles', path, args);
    console.log(sources);

    if (path.includes('group') || path.includes('groups')) {
      // only need to compare group and org  on Org User.roles resolver( i think )
      return obj.User.groupRoles(sources, args, context, info);
    } else {
      // otherwise we don't apply, so move on down the resolver chain
      return currResolver(sources, args, context, info);
    }
  };

  obj.User.groupRoles = createBatchResolver(async (source, args, context, info) => {
    // console.log("User.groupRoles - source", source)

    // look at path to determine if we need to filter at all
    let path = info.path;
    let matchFilter = null;
    let resultFilter = null;
    let selectOverrides = null;
    let joins = [];
    let filters = [];
    while (path) {
      if (path.key === 'orgs' || path.key === 'org') {
        let oids = _.uniq(source.map(s => s.orgId));

        joins.push({
          table: 'orgs_groups',
          join: 'left',
          args: ['orgs_groups.group_id', 'group_roles.group_id']
        });
        filters.push({
          bool: 'and',
          table: 'orgs_groups',
          field: 'org_id',
          compare: 'in',
          values: oids
        });

        selectOverrides = ['group_roles.*', 'orgs_groups.group_id', 'orgs_groups.org_id', 'group_roles.id AS role_id'];

        resultFilter = 'orgId';
        break;
      }
      if (path.key === 'groups' || path.key === 'groups') {
        resultFilter = 'groupId';
        break;
      }
      path = path.prev;
    }

    let ids = _.uniq(source.map(s => s.userId));
    const userRoles = await context.Authz.getGroupRolesForUsers({ ids });
    // console.log("===".repeat(25))
    // console.log("userRoles", userRoles)
    // console.log("===".repeat(25))
    const rids = _.uniq(_.map(_.flatten(userRoles), elem => elem.roleId));
    args.ids = rids;
    args.joins = args.joins ? args.joins.concat(joins) : joins;
    args.filters = args.filters ? args.filters.concat(filters.slice(1)) : filters;
    args.selectOverride = selectOverrides;
    // console.log("args", args)
    const roles = await context.Authz.getGroupRoles(args);

    // console.log("roles", roles)
    // console.log("===".repeat(25))

    // console.log("FUCKING FILTERS", matchFilter, resultFilter)
    const ret = reconcileBatchManyToMany(source, userRoles, roles, 'userId', 'roleId', matchFilter, resultFilter);
    // console.log("User.groupRoles - ret", ret)
    return ret;
  });

  return obj;
}

function addQueries(obj) {
  obj.Query.groupRoles = async function(obj, args, context) {
    return context.Authz.getGroupRoles(args);
  };

  obj.Query.groupRole = async function(obj, args, context) {
    return context.Authz.getGroupRole(args.id);
  };

  return obj;
}

function addMutations(obj) {
  obj.Mutation.createGroupRole = authSwitch([
    {
      requiredScopes: ['group:iam/create', 'admin:group:iam/create'],
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
      callback: async function(obj, args, context) {
        return context.Authz.createGroupRole(args.input);
      }
    }
  ]);

  obj.Mutation.updateGroupRole = authSwitch([
    {
      requiredScopes: ['group:iam/update', 'admin:group:iam/update'],
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
      callback: async function(obj, args, context) {
        return context.Authz.updateGroupRole(args.id, args.input);
      }
    }
  ]);

  obj.Mutation.deleteGroupRole = authSwitch([
    {
      requiredScopes: ['group:iam/delete', 'admin:group:iam/delete'],
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
      callback: async function(obj, args, context) {
        return context.Authz.deleteGroupRole(args.id);
      }
    }
  ]);

  obj.Mutation.grantPermissionToGroupRole = authSwitch([
    {
      requiredScopes: ['group:iam/update', 'admin:group:iam/update'],
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
      callback: async function(obj, args, context) {
        try {
          let ret = await context.Authz.grantPermissionToGroupRole(args.permissionId, args.roleId);
          if (!ret) {
            return {
              permission: null,
              role: null,
              errors: [{ field: 'general', message: 'something went wrong, please try again later' }]
            };
          } else {
            let role = await context.Authz.getGroupRole({ id: args.roleId });
            let permission = await context.Authz.getPermission({ id: args.permissionId });
            return { permission, role, errors: null };
          }
        } catch (e) {
          return { permission: null, role: null, errors: [e] };
        }
      }
    }
  ]);

  obj.Mutation.revokePermissionFromGroupRole = authSwitch([
    {
      requiredScopes: ['group:iam/update', 'admin:group:iam/update'],
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
      callback: async function(obj, args, context) {
        try {
          let ret = await context.Authz.revokePermissionFromGroupRole(args.permissionId, args.roleId);
          if (!ret) {
            return {
              permission: null,
              role: null,
              errors: [{ field: 'general', message: 'something went wrong, please try again later' }]
            };
          } else {
            let role = await context.Authz.getGroupRole({ id: args.roleId });
            let permission = await context.Authz.getPermission({ id: args.permissionId });
            return { permission, role, errors: null };
          }
        } catch (e) {
          return { permission: null, role: null, errors: [e] };
        }
      }
    }
  ]);

  obj.Mutation.grantGroupRoleToUser = authSwitch([
    {
      requiredScopes: ['group:members:iam/update', 'admin:group:members:iam/update'],
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
      callback: async function(obj, args, context) {
        try {
          let ret = await context.Authz.grantGroupRoleToUser(args.roleId, args.userId);
          if (!ret) {
            return {
              user: null,
              role: null,
              errors: [{ field: 'general', message: 'something went wrong, please try again later' }]
            };
          } else {
            let role = await context.Authz.getGroupRole({ id: args.roleId });
            let user = await context.User.get({ id: args.userId });
            return { user, role, errors: null };
          }
        } catch (e) {
          return { user: null, role: null, errors: [e] };
        }
      }
    }
  ]);

  obj.Mutation.revokeGroupRoleFromUser = authSwitch([
    {
      requiredScopes: ['group:members:iam/update', 'admin:group:members:iam/update'],
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
      callback: async function(obj, args, context) {
        try {
          let ret = await context.Authz.revokeGroupRoleFromUser(args.roleId, args.userId);
          if (!ret) {
            return {
              user: null,
              role: null,
              errors: [{ field: 'general', message: 'something went wrong, please try again later' }]
            };
          } else {
            let role = await context.Authz.getGroupRole({ id: args.roleId });
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
