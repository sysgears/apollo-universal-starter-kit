import _ from 'lodash';
import { camelizeKeys } from 'humps';

import {
  createAdapter,
  listAdapter,
  updateAdapter,
  deleteAdapter,
  getManyRelationAdapter,
  createRelationAdapter,
  deleteRelationAdapter
} from '../../../../stores/sql/knex/helpers/crud';

import knex from '../../../../stores/sql/knex/client';
import log from '../../../../../common/log';

export const getGroupRoles = listAdapter('group_roles', { selects: ['*', 'id AS roleId'] });
export const createGroupRole = createAdapter('group_roles');
export const updateGroupRole = updateAdapter('group_roles');
export const deleteGroupRole = deleteAdapter('group_roles');

export const getGroupRolesForGroups = getManyRelationAdapter('group_roles', {
  elemField: 'roleId',
  collectionField: 'groupId',
  selects: ['*', 'id AS roleId']
});

export const grantPermissionToGroupRole = createRelationAdapter('group_role_permission_bindings', {
  elemField: 'permissionId',
  collectionField: 'roleId'
});
export const revokePermissionFromGroupRole = deleteRelationAdapter('group_role_permission_bindings', {
  elemField: 'permissionId',
  collectionField: 'roleId'
});

export const getGroupRolesForPermissions = getManyRelationAdapter('group_role_permission_bindings', {
  elemField: 'roleId',
  collectionField: 'permissionId'
});
export const getPermissionsForGroupRoles = getManyRelationAdapter('group_role_permission_bindings', {
  elemField: 'permissionId',
  collectionField: 'roleId'
});

export const grantGroupRoleToUser = createRelationAdapter('group_role_user_bindings', {
  elemField: 'roleId',
  collectionField: 'userId'
});
export const revokeGroupRoleFromUser = deleteRelationAdapter('group_role_user_bindings', {
  elemField: 'roleId',
  collectionField: 'userId'
});

export const getGroupRolesForUsers = getManyRelationAdapter('group_role_user_bindings', {
  elemField: 'roleId',
  collectionField: 'userId'
});
export const getUsersForGroupRoles = getManyRelationAdapter('group_role_user_bindings', {
  elemField: 'userId',
  collectionField: 'roleId'
});

export async function getGroupRolesForUser(id, trx) {
  try {
    let builder = await knex
      .select('b.role_id', 'r.group_id', 'r.name', 'g.name AS groupName')
      .from('group_role_user_bindings AS b')
      .where('b.user_id', id)
      .leftJoin('group_roles AS r', 'r.id', 'b.role_id')
      .leftJoin('groups as g', 'r.group_id', 'g.id');

    if (trx) {
      builder.transacting(trx);
    }

    let rows = await builder;

    let res = _.filter(rows, r => r.name !== null);
    res = camelizeKeys(res);

    let ret = {};
    for (let r of res) {
      let cur = ret[r.groupId];
      if (!cur) {
        cur = {
          groupId: r.groupId,
          groupName: r.groupName,
          roles: []
        };
      }
      cur.roles.push({
        name: r.name,
        id: r.roleId
      });
      ret[cur.groupId] = cur;
    }

    let real = [];
    for (let key in ret) {
      real.push(ret[key]);
    }

    return real;
  } catch (e) {
    log.error('Error in Authz.getGroupRolesForUser', e);
    throw e;
  }
}
