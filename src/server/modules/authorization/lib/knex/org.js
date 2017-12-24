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
} from '../../../../sql/crud';

import knex from '../../../../sql/connector';
import log from '../../../../../common/log';

export const getOrgRoles = listAdapter('org_roles', { selects: ['*', 'id AS roleId'] });
export const createOrgRole = createAdapter('org_roles');
export const updateOrgRole = updateAdapter('org_roles');
export const deleteOrgRole = deleteAdapter('org_roles');

export const getOrgRolesForOrgs = getManyRelationAdapter('org_roles', {
  elemField: 'roleId',
  collectionField: 'orgId',
  selects: ['*', 'id AS roleId']
});

export const grantPermissionToOrgRole = createRelationAdapter('org_role_permission_bindings', {
  elemField: 'permissionId',
  collectionField: 'roleId'
});
export const revokePermissionFromOrgRole = deleteRelationAdapter('org_role_permission_bindings', {
  elemField: 'permissionId',
  collectionField: 'roleId'
});

export const getOrgRolesForPermissions = getManyRelationAdapter('org_role_permission_bindings', {
  elemField: 'roleId',
  collectionField: 'permissionId'
});
export const getPermissionsForOrgRoles = getManyRelationAdapter('org_role_permission_bindings', {
  elemField: 'permissionId',
  collectionField: 'roleId'
});

export const grantOrgRoleToUser = createRelationAdapter('org_role_user_bindings', {
  elemField: 'roleId',
  collectionField: 'userId'
});
export const revokeOrgRoleFromUser = deleteRelationAdapter('org_role_user_bindings', {
  elemField: 'roleId',
  collectionField: 'userId'
});

export const getOrgRolesForUsers = getManyRelationAdapter('org_role_user_bindings', {
  elemField: 'roleId',
  collectionField: 'userId'
});
export const getUsersForOrgRoles = getManyRelationAdapter('org_role_user_bindings', {
  elemField: 'userId',
  collectionField: 'roleId'
});

// singular version of the above
export async function getOrgRolesForUser(id, trx) {
  try {
    let builder = await knex
      .select('b.role_id', 'r.org_id', 'r.name', 'o.name AS orgName')
      .from('org_role_user_bindings AS b')
      .where('b.user_id', id)
      .leftJoin('org_roles AS r', 'r.id', 'b.role_id')
      .leftJoin('orgs AS o', 'r.org_id', 'o.id');

    if (trx) {
      builder.transacting(trx);
    }

    let rows = await builder;

    let res = _.filter(rows, r => r.name !== null);
    res = camelizeKeys(res);

    let ret = {};
    for (let r of res) {
      let cur = ret[r.orgId];
      if (!cur) {
        cur = {
          orgId: r.orgId,
          orgName: r.orgName,
          roles: []
        };
      }
      cur.roles.push({
        name: r.name,
        id: r.roleId
      });
      ret[cur.orgId] = cur;
    }

    // console.log("Authz.getOrgRolesForUser - ret", ret)
    let real = [];
    for (let key in ret) {
      real.push(ret[key]);
    }

    // console.log("Authz.getOrgRolesForUser - real", real)
    return real;
  } catch (e) {
    log.error('Error in Authz.getOrgRolesForUser', e);
    throw e;
  }
}
