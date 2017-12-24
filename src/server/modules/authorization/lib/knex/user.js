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
import settings from '../../../../../../settings';

import { getGroupRolesForUser, getGroupRolesForUsers } from './group';
import { getOrgRolesForUser, getOrgRolesForUsers } from './org';

const entities = settings.entities;
const authz = settings.auth.authorization;
const staticUserScopes = authz.userScopes;
const staticGroupScopes = authz.groupScopes;
const staticOrgScopes = authz.orgScopes;

export const getUserRoles = listAdapter('user_roles', { selects: ['*', 'id AS roleId'] });
export const createUserRole = createAdapter('user_roles');
export const updateUserRole = updateAdapter('user_roles');
export const deleteUserRole = deleteAdapter('user_roles');

export const grantPermissionToUserRole = createRelationAdapter('user_role_permission_bindings', {
  elemField: 'permissionId',
  collectionField: 'roleId'
});
export const revokePermissionFromUserRole = deleteRelationAdapter('user_role_permission_bindings', {
  elemField: 'permissionId',
  collectionField: 'roleId'
});

export const getUserRolesForPermissions = getManyRelationAdapter('user_role_permission_bindings', {
  elemField: 'roleId',
  collectionField: 'permissionId'
});
export const getPermissionsForUserRoles = getManyRelationAdapter('user_role_permission_bindings', {
  elemField: 'permissionId',
  collectionField: 'roleId'
});

export const grantUserRoleToUser = createRelationAdapter('user_role_user_bindings', {
  elemField: 'roleId',
  collectionField: 'userId'
});
export const revokeUserRoleFromUser = deleteRelationAdapter('user_role_user_bindings', {
  elemField: 'roleId',
  collectionField: 'userId'
});

export const getUserRolesForUsers = getManyRelationAdapter('user_role_user_bindings', {
  elemField: 'roleId',
  collectionField: 'userId'
});
export const getUsersForUserRoles = getManyRelationAdapter('user_role_user_bindings', {
  elemField: 'userId',
  collectionField: 'roleId'
});

export async function getUserRolesForUser(id, trx) {
  // console.log("Authz.getUserRolesForUser - in", id, typeof id)
  if (typeof id !== 'string') {
    id = id[0];
  }
  // console.log("Authz.getUserRolesForUser - id", id)
  try {
    let builder = knex
      .select('r.id', 'r.name')
      .from('user_role_user_bindings AS b')
      .where('b.user_id', id)
      .leftJoin('user_roles AS r', 'r.id', 'b.role_id');

    if (trx) {
      builder.transacting(trx);
    }

    let rows = await builder;
    // console.log("Authz.getUserRolesForUser - rows", rows)

    let res = _.filter(rows, r => r.name !== null);
    res = camelizeKeys(res);
    // console.log("Authz.getUserRolesForUser - res", res)
    return res;
  } catch (e) {
    log.error('Error in Authz.getUserRolesForUser', e);
    throw e;
  }
}

export async function getAllRolesForUsers(id, trx) {
  // TODO replace the following with a call to replace static scope lookup with a dynamic one
  // // ALSO, make this configurable, static or dynamic role/permission sets

  let groupRoles = null;
  let orgRoles = null;

  let userRoles = await getUserRolesForUsers({ ids: [id] }, trx);
  for (let role of userRoles) {
    const scopes = staticUserScopes[role.name];
    role.scopes = scopes;
    userRoles[role.name] = role;
  }

  if (entities.groups.enabled) {
    groupRoles = await getGroupRolesForUsers(id, trx);
    for (let gid in groupRoles) {
      let grp = groupRoles[gid];

      let scopes = [];
      for (let r in grp.roles) {
        let role = grp.roles[r];
        role.scopes = staticGroupScopes[role.name];
        grp.roles[role.name] = role;
        scopes = scopes.concat(role.scopes);
      }
      grp.scopes = scopes;

      groupRoles[gid] = grp;
    }
  } // end of groups

  if (entities.orgs.enabled) {
    orgRoles = await getOrgRolesForUsers(id, trx);
    for (let gid in orgRoles) {
      let o = orgRoles[gid];

      let scopes = [];
      for (let r in o.roles) {
        let role = o.roles[r];
        role.scopes = staticOrgScopes[role.name];
        o.roles[role.name] = role;
        scopes = scopes.concat(role.scopes);
      }
      o.scopes = scopes;

      orgRoles[gid] = o;
    }
  } // end of orgs
  return {
    userRoles,
    groupRoles,
    orgRoles
  };
}

export async function getAllRolesForUser(id, trx) {
  // TODO replace the following with a call to replace static scope lookup with a dynamic one
  // // ALSO, make this configurable, static or dynamic role/permission sets

  let groupRoles = null;
  let orgRoles = null;

  let userRoles = await getUserRolesForUser(id, trx);
  for (let role of userRoles) {
    const scopes = staticUserScopes[role.name];
    role.scopes = scopes;
    userRoles[role.name] = role;
  }

  if (entities.groups.enabled) {
    groupRoles = await getGroupRolesForUser(id, trx);
    for (let gid in groupRoles) {
      let grp = groupRoles[gid];

      let scopes = [];
      for (let r in grp.roles) {
        let role = grp.roles[r];
        role.scopes = staticGroupScopes[role.name];
        grp.roles[role.name] = role;
        scopes = scopes.concat(role.scopes);
      }
      grp.scopes = scopes;

      groupRoles[gid] = grp;
    }
  } // end of groups

  if (entities.orgs.enabled) {
    orgRoles = await getOrgRolesForUser(id, trx);
    for (let gid in orgRoles) {
      let o = orgRoles[gid];

      let scopes = [];
      for (let r in o.roles) {
        let role = o.roles[r];
        role.scopes = staticOrgScopes[role.name];
        o.roles[role.name] = role;
        scopes = scopes.concat(role.scopes);
      }
      o.scopes = scopes;

      orgRoles[gid] = o;
    }
  } // end of orgs
  return {
    userRoles,
    groupRoles,
    orgRoles
  };
}
