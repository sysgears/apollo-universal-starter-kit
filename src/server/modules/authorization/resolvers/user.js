/*eslint-disable no-unused-vars*/
import { _ } from 'lodash';
import { createBatchResolver } from 'graphql-resolve-batch';

import FieldError from '../../../../common/FieldError';
import { withAuth } from '../../../../common/authValidation';
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
      return obj.roleId ? obj.roleId : obj.id;
    },
    name(obj) {
      return obj.name;
    },
    roleId(obj) {
      return obj.id;
    },
    roleName(obj) {
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
      const rolePerms = await context.Authz.getPermissionsForUserRoles({ ids });

      const pids = _.uniq(_.map(_.flatten(rolePerms), elem => elem.permissionId));
      args.ids = pids;
      const perms = await context.Authz.getPermissions(args);

      const ret = reconcileBatchManyToMany(source, rolePerms, perms, 'roleId', 'permissionId');
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
    userRoles: createBatchResolver(async (source, args, context) => {
      let ids = _.uniq(source.map(s => s.userId));
      const userRoles = await context.Authz.getUserRolesForUsers({ ids });

      const rids = _.uniq(_.map(_.flatten(userRoles), elem => elem.roleId));
      args.ids = rids;
      const roles = await context.Authz.getUserRoles(args);

      const ret = reconcileBatchManyToMany(source, userRoles, roles, 'userId', 'roleId');
      return ret;
    })
  };

  return obj;
}

function addQueries(obj) {
  // obj.Query.userRoles = withAuth(['user:iam/all/view'], async function(obj, args, context) {
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
  obj.Mutation.createUserRole = withAuth(['user:iam/all/create'], async function(obj, args, context) {
    try {
      let rid = await context.Authz.createUserRole(args.input);
      let role = await context.Authz.getUserRoles([rid]);
      return { role, errors: null };
    } catch (e) {
      return { role: null, errors: [e] };
    }
  });

  obj.Mutation.updateUserRole = withAuth(['user:iam/all/update'], async function(obj, args, context) {
    try {
      await context.Authz.updateUserRole(args.id, args.input);
      let role = await context.Authz.getUserRoles([args.id]);
      return { role, errors: null };
    } catch (e) {
      return { role: null, errors: [e] };
    }
  });

  obj.Mutation.deleteUserRole = withAuth(['user:iam/all/delete'], async function(obj, args, context) {
    try {
      let ret = await context.Authz.deleteUserRole(args.id);
      if (!ret) {
        return { role: null, errors: [{ field: 'general', message: 'something went wrong, please try again later' }] };
      } else {
        return { role: null, errors: null };
      }
    } catch (e) {
      return { role: null, errors: [e] };
    }
  });

  obj.Mutation.grantPermissionToUserRole = withAuth(['user:iam/all/update'], async function(obj, args, context) {
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
  });

  obj.Mutation.revokePermissionFromUserRole = withAuth(['user:iam/all/update'], async function(obj, args, context) {
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
  });

  obj.Mutation.grantUserRoleToUser = withAuth(['user:iam/all/update'], async function(obj, args, context) {
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
        let user = await context.User.get(args.userId);
        return { user, role, errors: null };
      }
    } catch (e) {
      return { user: null, role: null, errors: [e] };
    }
  });

  obj.Mutation.revokeUserRoleFromUser = withAuth(['user:iam/all/update'], async function(obj, args, context) {
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
        let user = await context.User.get(args.userId);
        return { user, role, errors: null };
      }
    } catch (e) {
      return { user: null, role: null, errors: [e] };
    }
  });

  return obj;
}
