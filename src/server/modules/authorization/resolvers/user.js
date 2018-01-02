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
  obj.UserRoleInfo = {
    id(obj) {
      return obj.roleId ? obj.roleId : null;
    },
    name(obj) {
      return obj.roleName ? obj.roleName : null;
    },
    roleId(obj) {
      return obj.roleId ? obj.roleId : null;
    },
    roleName(obj) {
      return obj.roleName ? obj.roleName : null;
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

    /*
    permissions: createBatchResolver( async (sources, args, context, info) => {

      console.log("UserRoleInfo.permissions - sources", sources.length)
      let path = info.path
      while(path){
        console.log(path.key)
        path = path.prev
      }
      console.log()

      / *
      console.log("UserRoleInfo.permissions")
      console.log("=".repeat(33))
      console.log(obj)
      console.log("=".repeat(33))
      console.log(args)
      console.log("=".repeat(33))
      * /


      let ids = _.uniq(sources.map(s => s.id));
      const rolePerms = await context.Authz.getPermissionsForUserRoles({ ids });

      const pids = _.uniq(_.map(_.flatten(rolePerms), elem => elem.permissionId));
      args.ids = pids;
      const perms = await context.Authz.getPermissions(args);

      const ret = reconcileBatchManyToMany(sources, rolePerms, perms, 'roleId', 'permissionId');


      console.log("UserRoleInfo.permissions - ret", ret.length)
      return ret;



      return sources
    }),
    */

    permissions: createBatchResolver(async (source, args, context, info) => {
      console.log('UserRoleInfo.permissions - input', source, args);
      /*
      console.log(
        'UserRoleInfo.permissions',
        source.map(elem => {
          return { roleId: elem.roleId, roleName: elem.roleName, count: elem.permissions.length };
        })
      );
      if (source[0].permissions) {
        return source.map(elem => elem.permissions);
      }
      */
      let ids = _.uniq(source.map(s => s.roleId || s.id));
      const rolePerms = await context.Authz.getPermissionsForUserRoles(ids);

      const pids = _.uniq(_.map(_.flatten(rolePerms), elem => elem.permissionId));
      console.log('UserRoleInfo.permissions - args', args);
      const perms = await context.Authz.getPermissions(args);

      console.log('UserRoleInfo.permissions - perms', perms);
      const ret = reconcileBatchManyToMany(source, rolePerms, perms, 'roleId', 'permissionId');
      console.log('UserRoleInfo.permissions - ret', ret);
      return ret;
    }),

    users: createBatchResolver(async (source, args, context) => {
      let ids = _.uniq(source.map(s => s.id));
      const roleUsers = await context.Authz.getUsersForUserRoles({ ids });

      const uids = _.uniq(_.map(_.flatten(roleUsers), elem => elem.userId));
      args.ids = uids;
      const users = await context.User.getMany(args);

      const ret = reconcileBatchManyToMany(source, roleUsers, users, 'roleId', 'userId');
      return ret;
    })
  };

  obj.User = {
    roles: async (sources, args, context, info) => {
      console.log('User.roles - user handler');
      let localObj = obj;
      return obj.User.userRoles(sources, args, context, info);
    },
    userRoles: createBatchResolver(async (sources, args, context, info) => {
      // console.log("User.userRoles - source", source)
      let localObj = obj;
      let path = [];
      let ipath = info.path;
      while (ipath) {
        path.push(ipath.key);
        ipath = ipath.prev;
      }
      console.log('User.userRoles', path, args);

      console.log('User.userRoles', sources);

      let ids = _.uniq(sources.map(s => s.userId));
      let userRoles = await context.Authz.getUserRolesAndPermissionsForUsers({ ids });
      userRoles = userRoles.map(elem => {
        let ret = [];
        for (let role of elem.userRoles) {
          ret.push({
            userId: elem.userId,
            roleId: role.roleId,
            roleName: role.roleName,
            permissions: role.permissions
          });
        }
        return ret;
      });

      console.log('User.userRoles - userRoles', userRoles);

      let ret = reconcileBatchOneToMany(sources, userRoles, 'userId');
      // console.log("User.userRoles - ret", ret)
      console.log('User.userRoles - ret', ret);
      return ret;
    })
  };

  return obj;
}

function addQueries(obj) {
  obj.Query.userRoles = authSwitch([
    {
      requiredScopes: ['admin:app:user:iam/list'],
      callback: async function(obj, args, context) {
        return context.Authz.getUserRoles(args);
      }
    }
  ]);

  obj.Query.userRoles = authSwitch([
    {
      requiredScopes: ['admin:app:user:iam/view'],
      callback: async function(obj, args, context) {
        return context.Authz.getUserRoles(args);
      }
    }
  ]);

  return obj;
}

function addMutations(obj) {
  obj.Mutation.createUserRole = authSwitch([
    {
      requiredScopes: ['admin:app:user:iam/create'],
      callback: async function(obj, args, context) {
        try {
          let rid = await context.Authz.createUserRole(args.input);
          let role = await context.Authz.getUserRoles([rid]);
          return { role, errors: null };
        } catch (e) {
          return { role: null, errors: [e] };
        }
      }
    }
  ]);

  obj.Mutation.updateUserRole = authSwitch([
    {
      requiredScopes: ['admin:app:user:iam/update'],
      callback: async function(obj, args, context) {
        try {
          await context.Authz.updateUserRole(args.id, args.input);
          let role = await context.Authz.getUserRoles([args.id]);
          return { role, errors: null };
        } catch (e) {
          return { role: null, errors: [e] };
        }
      }
    }
  ]);

  obj.Mutation.deleteUserRole = authSwitch([
    {
      requiredScopes: ['admin:app:user:iam/delete'],
      callback: async function(obj, args, context) {
        try {
          let ret = await context.Authz.deleteUserRole(args.id);
          if (!ret) {
            return {
              role: null,
              errors: [{ field: 'general', message: 'something went wrong, please try again later' }]
            };
          } else {
            return { role: null, errors: null };
          }
        } catch (e) {
          return { role: null, errors: [e] };
        }
      }
    }
  ]);

  obj.Mutation.grantPermissionToUserRole = authSwitch([
    {
      requiredScopes: ['admin:user:iam/update'],
      callback: async function(obj, args, context) {
        try {
          let ret = await context.Authz.grantPermissionToUserRole(args.permissionId, args.roleId);
          if (!ret) {
            return {
              permission: null,
              role: null,
              errors: [{ field: 'general', message: 'something went wrong, please try again later' }]
            };
          } else {
            let role = await context.Authz.getUserRoles([args.roleId]);
            let permission = await context.Authz.getPermission(args.permissionId);
            return { permission, role, errors: null };
          }
        } catch (e) {
          return { permission: null, role: null, errors: [e] };
        }
      }
    }
  ]);

  obj.Mutation.revokePermissionFromUserRole = authSwitch([
    {
      requiredScopes: ['admin:user:iam/update'],
      callback: async function(obj, args, context) {
        try {
          let ret = await context.Authz.revokePermissionFromUserRole(args.permissionId, args.roleId);
          if (!ret) {
            return {
              permission: null,
              role: null,
              errors: [{ field: 'general', message: 'something went wrong, please try again later' }]
            };
          } else {
            let role = await context.Authz.getUserRoles([args.roleId]);
            let permission = await context.Authz.getPermission(args.permissionId);
            return { permission, role, errors: null };
          }
        } catch (e) {
          return { permission: null, role: null, errors: [e] };
        }
      }
    }
  ]);

  obj.Mutation.grantUserRoleToUser = authSwitch([
    {
      requiredScopes: ['admin:user:iam/update'],
      callback: async function(obj, args, context) {
        try {
          let ret = await context.Authz.grantUserRoleToUser(args.roleId, args.userId);
          if (!ret) {
            return {
              user: null,
              role: null,
              errors: [{ field: 'general', message: 'something went wrong, please try again later' }]
            };
          } else {
            let role = await context.Authz.getUserRoles([args.roleId]);
            let user = await context.User.get({ id: args.userId });
            return { user, role, errors: null };
          }
        } catch (e) {
          return { user: null, role: null, errors: [e] };
        }
      }
    }
  ]);

  obj.Mutation.revokeUserRoleFromUser = authSwitch([
    {
      requiredScopes: ['admin:user:iam/update'],
      callback: async function(obj, args, context) {
        try {
          let ret = await context.Authz.revokeUserRoleFromUser(args.roleId, args.userId);
          if (!ret) {
            return {
              user: null,
              role: null,
              errors: [{ field: 'general', message: 'something went wrong, please try again later' }]
            };
          } else {
            let role = await context.Authz.getUserRoles([args.roleId]);
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
