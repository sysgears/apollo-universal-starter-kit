import _ from 'lodash';
import { camelizeKeys } from 'humps';

import {
  getAdapter,
  listAdapter,
  createWithIdGenAdapter,
  updateAdapter,
  deleteAdapter,
  getManyRelationAdapter,
  createRelationAdapter,
  deleteRelationAdapter
} from '../../../../stores/sql/knex/helpers/crud';

import selectAdapter from '../../../../stores/sql/knex/helpers/select';
import { orderedFor } from '../../../../stores/sql/knex/helpers/batching';

export const getGroupRole = getAdapter({ table: 'group_roles' });
export const getGroupRoles = listAdapter({ table: 'group_roles', selects: ['*', 'id AS role_id'] });
export const createGroupRole = createWithIdGenAdapter({ table: 'group_roles' });
export const updateGroupRole = updateAdapter({ table: 'group_roles' });
export const deleteGroupRole = deleteAdapter({ table: 'group_roles' });

export const getGroupRolesForGroups = getManyRelationAdapter({
  table: 'group_roles',
  elemField: 'role_id',
  collectionField: 'group_id',
  selects: ['*', 'id AS role_id']
});

export const grantPermissionToGroupRole = createRelationAdapter({
  table: 'group_role_permission_bindings',
  elemField: 'permission_id',
  collectionField: 'role_id'
});
export const revokePermissionFromGroupRole = deleteRelationAdapter({
  table: 'group_role_permission_bindings',
  elemField: 'permission_id',
  collectionField: 'role_id'
});

export const getGroupRolesForPermissions = getManyRelationAdapter({
  table: 'group_role_permission_bindings',
  elemField: 'role_id',
  collectionField: 'permission_id'
});
export const getPermissionsForGroupRoles = getManyRelationAdapter({
  table: 'group_role_permission_bindings',
  elemField: 'permission_id',
  collectionField: 'role_id'
});

export const grantGroupRoleToUser = createRelationAdapter({
  table: 'group_role_user_bindings',
  elemField: 'role_id',
  collectionField: 'user_id'
});
export const revokeGroupRoleFromUser = deleteRelationAdapter({
  table: 'group_role_user_bindings',
  elemField: 'role_id',
  collectionField: 'user_id'
});

export const getGroupRolesForUsers = getManyRelationAdapter({
  table: 'group_role_user_bindings',
  elemField: 'role_id',
  collectionField: 'user_id'
});
export const getUsersForGroupRoles = getManyRelationAdapter({
  table: 'group_role_user_bindings',
  elemField: 'user_id',
  collectionField: 'role_id'
});

export async function getGroupRolesForUser(args, trx) {
  const rows = await getGroupRolesForUserSelector(args, trx);
  return camelizeKeys(rows);
}
export const getGroupRolesForUserSelector = selectAdapter({
  table: 'group_role_user_bindings AS UB',
  name: 'getGroupRolesForUserSelector',
  selects: ['r.id', 'r.name'],
  joins: [
    {
      table: 'group_roles AS r',
      join: 'left',
      args: ['UB.role_id', 'r.id']
    }
  ],
  filters: [
    {
      table: 'UB',
      field: 'user_id',
      compare: '=',
      valueExtractor: args => args.id
    }
  ]
});

export async function getGroupRolesAndPermissionsForUser(args, trx) {
  let ret = await getGroupRolesAndPermissionsForUsersSelector(args, trx);
  ret = camelizeKeys(ret);

  let gids = _.uniq(ret.map(elem => elem.groupId));
  let roles = orderedFor(ret, gids, 'groupId', false);

  let final = [];
  for (let gid of gids) {
    const gr = roles.filter(elem => elem[0].groupId === gid);
    if (!gr) {
      continue;
    }

    const groupName = gr[0][0].groupName;
    let rs = [];
    for (let r of gr) {
      let roleId = r[0].roleId;
      let roleName = r[0].roleName;
      rs.push({
        roleId,
        roleName,
        permissions: r
      });
    }

    let g = {
      groupId: gid,
      groupName: groupName,
      permissions: _.flatten(gr),
      roles: rs
    };
    final.push(g);
  }

  return final;
}

export async function getGroupRolesAndPermissionsForUsers(args, trx) {
  let ret = await getGroupRolesAndPermissionsForUsersSelector(args, trx);
  ret = camelizeKeys(ret);

  let uids = _.uniq(ret.map(elem => elem.userId));
  let users = orderedFor(ret, uids, 'userId', false);

  let final = [];
  for (let uid of uids) {
    let user = users.find(elem => elem[0].userId == uid);

    let gids = _.uniq(user.map(elem => elem.groupId));
    let roles = orderedFor(user, gids, 'groupId', false);

    let userFinal = [];
    for (let gid of gids) {
      const gr = roles.filter(elem => elem[0].groupId === gid);
      if (!gr) {
        continue;
      }

      const groupName = gr[0][0].groupName;
      let rs = [];
      for (let r of gr) {
        let roleId = r[0].roleId;
        let roleName = r[0].roleName;
        rs.push({
          roleId,
          roleName,
          permissions: r
        });
      }

      let g = {
        groupId: gid,
        groupName: groupName,
        permissions: _.flatten(gr),
        roles: rs
      };
      userFinal.push(g);
    }

    let u = {
      userId: uid,
      groupRoles: userFinal
    };

    final.push(u);
  }

  return final;
}

export const getGroupRolesAndPermissionsForUsersSelector = selectAdapter({
  table: 'groups AS G',
  name: 'getGroupRolesAndPermissionsForUserSelector',
  selects: ['*', 'G.name AS groupName', 'GR.name AS roleName', 'P.name AS permissionName'],
  joins: [
    {
      table: 'group_roles AS GR',
      join: 'left',
      args: ['G.id', 'GR.group_id']
    },
    {
      table: 'group_role_user_bindings AS UB',
      join: 'left',
      args: ['GR.id', 'UB.role_id']
    },
    {
      table: 'group_role_permission_bindings AS PB',
      join: 'left',
      args: ['UB.role_id', 'PB.role_id']
    },
    {
      table: 'permissions AS P',
      join: 'left',
      args: ['PB.permission_id', 'P.id']
    }
  ],
  filters: [
    {
      applyWhen: args => args.id,
      table: 'UB',
      field: 'user_id',
      compare: '=',
      valueExtractor: args => args.id
    },
    {
      applyWhen: args => args.ids,
      table: 'UB',
      field: 'user_id',
      compare: 'in',
      valueExtractor: args => args.ids
    }
  ],
  orderBys: [
    {
      table: 'UB',
      column: 'user_id'
    },
    {
      table: 'P',
      column: 'resource'
    },
    {
      table: 'P',
      column: 'relation'
    },
    {
      table: 'P',
      column: 'verb'
    }
  ]
});
