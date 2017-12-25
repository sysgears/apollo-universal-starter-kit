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
  obj.GroupRoleInfo = {
    group: createBatchResolver(async (source, args, context) => {
      let gids = _.uniq(source.map(s => s.groupId));
      args.ids = gids;
      let groups = await context.Group.getMany(args);
      const ret = reconcileBatchOneToOne(source, groups, 'groupId');
      return ret;
    }),
    groupId(obj) {
      return obj.groupId ? obj.groupId : obj.id;
    },
    groupName(obj) {
      return obj.groupName ? obj.groupName : obj.name;
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
      const rolePerms = await context.Authz.getPermissionsForGroupRoles({ ids });

      const pids = _.uniq(_.map(_.flatten(rolePerms), elem => elem.permissionId));
      args.ids = pids;
      const perms = await context.Authz.getPermissions(args);

      const ret = reconcileBatchManyToMany(source, rolePerms, perms, 'roleId', 'permissionId');
      return ret;
    }),
    users: createBatchResolver(async (source, args, context) => {
      let ids = _.uniq(source.map(s => s.id));
      const roleUsers = await context.Authz.getUsersForGroupRoles({ ids });

      const uids = _.uniq(_.map(_.flatten(roleUsers), elem => elem.userId));
      args.ids = uids;
      const users = await context.User.getMany(args);

      const ret = reconcileBatchManyToMany(source, roleUsers, users, 'roleId', 'userId');
      return ret;
    })
  };

  obj.Group = {
    roles: createBatchResolver(async (source, args, context) => {
      let ids = _.uniq(source.map(s => s.groupId));
      args.ids = ids;
      const roles = await context.Authz.getGroupRolesForGroups(args);
      const ret = reconcileBatchOneToMany(source, roles, 'groupId');
      return ret;
    })
  };

  obj.User.groupRoles = createBatchResolver(async (source, args, context) => {
    let ids = _.uniq(source.map(s => s.userId));
    const userRoles = await context.Authz.getGroupRolesForUsers({ ids });
    const rids = _.uniq(_.map(_.flatten(userRoles), elem => elem.roleId));

    args.ids = rids;
    const roles = await context.Authz.getGroupRoles(args);

    const ret = reconcileBatchManyToMany(source, userRoles, roles, 'userId', 'roleId');
    return ret;
  });

  return obj;
}

function addQueries(obj) {
  // obj.Query.groupRoles = withAuth(['user:iam/all/view'], async function(obj, args, context) {
  obj.Query.groupRoles = async function(obj, args, context) {
    return context.Authz.getGroupRoles(args);
  };

  obj.Query.groupRole = async function(obj, args, context) {
    return context.Authz.getGroupRoles({ ids: [args.id] });
  };

  return obj;
}

function addMutations(obj) {
  obj.Mutation.createGroupRole = withAuth(['user:iam/all/create'], async function(obj, args, context) {
    return context.Authz.createGroupRole(args.input);
  });

  obj.Mutation.updateGroupRole = withAuth(['user:iam/all/update'], async function(obj, args, context) {
    return context.Authz.updateGroupRole(args.id, args.input);
  });

  obj.Mutation.deleteGroupRole = withAuth(['user:iam/all/delete'], async function(obj, args, context) {
    return context.Authz.deleteGroupRole(args.id);
  });

  obj.Mutation.grantPermissionToGroupRole = withAuth(['group:iam/all/update'], async function(obj, args, context) {
    try {
      let ret = await context.Authz.grantPermissionToGroupRole(args.permissionId, args.roleId);
      if (!ret) {
        return {
          permission: null,
          role: null,
          errors: [{ field: 'general', message: 'something went wrong, please try again later' }]
        };
      } else {
        let role = await context.Authz.getGroupRoles([args.roleId]);
        let permission = await context.Authz.getPermission(args.permissionId);
        return { permission, role, errors: null };
      }
    } catch (e) {
      return { permission: null, role: null, errors: [e] };
    }
  });

  obj.Mutation.revokePermissionFromGroupRole = withAuth(['group:iam/all/update'], async function(obj, args, context) {
    try {
      let ret = await context.Authz.revokePermissionFromGroupRole(args.permissionId, args.roleId);
      if (!ret) {
        return {
          permission: null,
          role: null,
          errors: [{ field: 'general', message: 'something went wrong, please try again later' }]
        };
      } else {
        let role = await context.Authz.getGroupRoles([args.roleId]);
        let permission = await context.Authz.getPermission(args.permissionId);
        return { permission, role, errors: null };
      }
    } catch (e) {
      return { permission: null, role: null, errors: [e] };
    }
  });

  obj.Mutation.grantGroupRoleToUser = withAuth(['group:iam/all/update'], async function(obj, args, context) {
    try {
      let ret = await context.Authz.grantGroupRoleToUser(args.roleId, args.groupId);
      if (!ret) {
        return {
          group: null,
          role: null,
          errors: [{ field: 'general', message: 'something went wrong, please try again later' }]
        };
      } else {
        let role = await context.Authz.getGroupRoles([args.roleId]);
        let group = await context.User.get(args.groupId);
        return { group, role, errors: null };
      }
    } catch (e) {
      return { group: null, role: null, errors: [e] };
    }
  });

  obj.Mutation.revokeGroupRoleFromUser = withAuth(['group:iam/all/update'], async function(obj, args, context) {
    try {
      let ret = await context.Authz.revokeGroupRoleFromUser(args.roleId, args.groupId);
      if (!ret) {
        return {
          group: null,
          role: null,
          errors: [{ field: 'general', message: 'something went wrong, please try again later' }]
        };
      } else {
        let role = await context.Authz.getGroupRoles([args.roleId]);
        let group = await context.User.get(args.groupId);
        return { group, role, errors: null };
      }
    } catch (e) {
      return { group: null, role: null, errors: [e] };
    }
  });

  return obj;
}
