import _ from 'lodash';
import { camelizeKeys } from 'humps';

import {
  createWithIdGenAdapter,
  getAdapter,
  listAdapter,
  updateAdapter,
  deleteAdapter,
  getManyRelationAdapter,
  createRelationAdapter,
  deleteRelationAdapter
} from '../../../../stores/sql/knex/helpers/crud';

import selectAdapter from '../../../../stores/sql/knex/helpers/select';
import { orderedFor } from '../../../../stores/sql/knex/helpers/batching';

import { getGroupRolesForUser, getGroupRolesForUsers } from './group';
import { getOrgRolesForUser, getOrgRolesForUsers } from './org';

import settings from '../../../../../../settings';

const entities = settings.entities;
const authz = settings.auth.authorization;
const staticUserScopes = authz.userScopes;
const staticGroupScopes = authz.groupScopes;
const staticOrgScopes = authz.orgScopes;

export const getUserRole = getAdapter({ table: 'user_roles', selects: ['*', 'id AS role_id', 'name AS role_name'] });
export const getUserRoles = listAdapter({ table: 'user_roles', selects: ['*', 'id AS role_id', 'name AS role_name'] });
export const createUserRole = createWithIdGenAdapter({ table: 'user_roles' });
export const updateUserRole = updateAdapter({ table: 'user_roles' });
export const deleteUserRole = deleteAdapter({ table: 'user_roles' });

export const grantPermissionToUserRole = createRelationAdapter({
  table: 'user_role_permission_bindings',
  elemField: 'permission_id',
  collectionField: 'role_id'
});
export const revokePermissionFromUserRole = deleteRelationAdapter({
  table: 'user_role_permission_bindings',
  elemField: 'permission_id',
  collectionField: 'role_id'
});

export const getUserRolesForPermissions = getManyRelationAdapter({
  table: 'user_role_permission_bindings',
  elemField: 'role_id',
  collectionField: 'permission_id'
});
export const getPermissionsForUserRoles = getManyRelationAdapter({
  table: 'user_role_permission_bindings',
  elemField: 'permission_id',
  collectionField: 'role_id'
});

export const grantUserRoleToUser = createRelationAdapter({
  table: 'user_role_user_bindings',
  elemField: 'role_id',
  collectionField: 'user_id'
});
export const revokeUserRoleFromUser = deleteRelationAdapter({
  table: 'user_role_user_bindings',
  elemField: 'role_id',
  collectionField: 'user_id'
});

export const getUserRolesForUsers = getManyRelationAdapter({
  table: 'user_role_user_bindings',
  name: 'getUserRolesForUser',
  elemField: 'role_id',
  collectionField: 'user_id'
});
export const getUsersForUserRoles = getManyRelationAdapter({
  table: 'user_role_user_bindings',
  name: 'getUsersForUserRoles',
  elemField: 'user_id',
  collectionField: 'role_id'
});

export async function getUserRolesForUser(args, trx) {
  const rows = await getUserRolesForUserSelector(args, trx);
  return camelizeKeys(rows);
}
export const getUserRolesForUserSelector = selectAdapter({
  table: 'user_role_user_bindings AS UB',
  name: 'getUserRolesForUserSelector',
  selects: ['r.id', 'r.name'],
  joins: [
    {
      table: 'user_roles AS r',
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

export async function getUserRolesAndPermissionsForUser(args, trx) {
  let ret = await getUserRolesAndPermissionsForUsersSelector(args, trx);
  ret = camelizeKeys(ret);
  let rids = _.uniq(ret.map(elem => elem.roleId));
  let roles = orderedFor(ret, rids, 'roleId', false);

  let final = [];
  for (let rid of rids) {
    let ur = roles.filter(elem => elem[0].roleId === rid);
    if (!ur) {
      continue;
    }

    const roleName = ur[0][0].roleName;
    let u = {
      roleId: rid,
      roleName: roleName,
      permissions: _.flatten(ur)
    };
    final.push(u);
  }

  return final;
}

export async function getUserRolesAndPermissionsForUsers(args, trx) {
  let ret = await getUserRolesAndPermissionsForUsersSelector(args, trx);
  ret = camelizeKeys(ret);

  let uids = _.uniq(ret.map(elem => elem.userId));
  let users = orderedFor(ret, uids, 'userId', false);

  let final = [];
  for (let uid of uids) {
    let user = users.find(elem => elem[0].userId == uid);

    let rids = _.uniq(user.map(elem => elem.roleId));
    let roles = orderedFor(user, rids, 'roleId', false);

    let userFinal = [];
    for (let rid of rids) {
      let ur = roles.filter(elem => elem[0].roleId === rid);
      if (!ur) {
        continue;
      }

      const roleName = ur[0][0].roleName;
      let r = {
        roleId: rid,
        roleName: roleName,
        permissions: _.flatten(ur)
      };
      userFinal.push(r);
    }

    let u = {
      userId: uid,
      userRoles: userFinal
    };

    final.push(u);
  }

  return final;
}

export const getUserRolesAndPermissionsForUsersSelector = selectAdapter({
  table: 'user_roles AS UR',
  name: 'getUserRolesAndPermissionsForUserSelector',
  selects: ['*', 'UR.name AS roleName', 'P.name AS permissionName'],
  joins: [
    {
      table: 'user_role_user_bindings AS UB',
      join: 'left',
      args: ['UR.id', 'UB.role_id']
    },
    {
      table: 'user_role_permission_bindings AS PB',
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
      column: 'name'
    }
  ]
});

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

  let userRoles = await getUserRolesForUser({ id }, trx);
  for (let role of userRoles) {
    const scopes = staticUserScopes[role.name];
    role.scopes = scopes;
    userRoles[role.name] = role;
  }

  if (entities.groups.enabled) {
    groupRoles = await getGroupRolesForUser({ id }, trx);
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
    orgRoles = await getOrgRolesForUser({ id }, trx);
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
