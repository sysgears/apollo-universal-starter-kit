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

    permissions: authSwitch([
      {
        requiredScopes: (obj, args, context) => {
          // console.log("User.profile - self")
          return args.id === context.user.id ? ['user:profile/self/view'] : 'skip';
        },
        callback: async (sources, args, context, info) => {
          console.log('UserRoleInfo.permissions - self', sources, args);
          let ids = _.uniq(sources.map(s => s.id));
          const rolePerms = await context.Authz.getPermissionsForUserRoles({ ids });

          const pids = _.uniq(_.map(_.flatten(rolePerms), elem => elem.permissionId));
          args.ids = pids;
          const perms = await context.Authz.getPermissions(args);

          const ret = reconcileBatchManyToMany(sources, rolePerms, perms, 'roleId', 'permissionId');
          return ret;
        }
      },

      {
        requiredScopes: (obj, args, context) => {
          // console.log("User.profile - self")
          return args.id === context.user.id ? ['user:profile/self/'] : 'skip';
        },
        callback: createBatchResolver(async (source, args, context) => {
          console.log(
            'UserRoleInfo.permissions',
            source.map(elem => {
              return { roleId: elem.roleId, roleName: elem.roleName, count: elem.permissions.length };
            })
          );
          if (source[0].permissions) {
            return source.map(elem => elem.permissions);
          }
          let ids = _.uniq(source.map(s => s.id));
          const rolePerms = await context.Authz.getPermissionsForUserRoles({ ids });

          const pids = _.uniq(_.map(_.flatten(rolePerms), elem => elem.permissionId));
          args.ids = pids;
          const perms = await context.Authz.getPermissions(args);

          const ret = reconcileBatchManyToMany(source, rolePerms, perms, 'roleId', 'permissionId');
          return ret;
        })
      }
    ]),

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
    userRoles: authSwitch([
      {
        requiredScopes: (sources, args, context, info) => {},
        presentedScopes: (sources, args, context, info) => {},
        callback: (sources, args, context, info) => {}
      }
    ])
    /*
      createBatchResolver(async (sources, args, context, info) => {
      // console.log("User.userRoles - source", source)

      console.log("User.userRoles", sources.length)
      let path = info.path
      while(path){
        console.log(path.key)
        path = path.prev
      }
      console.log()

      let ids = _.uniq(sources.map(s => s.userId));
      const userRoles = await context.Authz.getUserRolesForUsers({ ids });
      // console.log("User.userRoles - userRoles", userRoles)

      let ret = reconcileBatchOneToOne(sources, userRoles, 'userId')
      // console.log("User.userRoles - ret", ret)
      console.log("User.userRoles - ret", ret.length)
      return ret

      // let final = ret.map( elem => elem.userRoles )
      // console.log("User.userRoles - final", final)

      return final;
    */
  };

  return obj;
}

function addQueries(obj) {
  obj.Query.userRoles = async function(obj, args, context) {
    return context.Authz.getUserRoles(args);
  };

  obj.Query.userRole = async function(obj, args, context) {
    let ret = await context.Authz.getUserRoles({ ids: [args.id] });
    // don't return a single element array
    if (ret && ret.length === 1) {
      ret = ret[0];
    }
    return ret;
  };

  return obj;
}

function addMutations(obj) {
  obj.Mutation.createUserRole = authSwitch([
    {
      requiredScopes: ['user:iam/superuser/create'],
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
      requiredScopes: ['user:iam/superuser/update'],
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
      requiredScopes: ['user:iam/superuser/delete'],
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
      requiredScopes: ['user:iam/superuser/update'],
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
      requiredScopes: ['user:iam/superuser/update'],
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
      requiredScopes: ['user:iam/superuser/update'],
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
      requiredScopes: ['user:iam/superuser/update'],
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
