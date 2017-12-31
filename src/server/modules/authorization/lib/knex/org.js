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

export const getOrgRole = getAdapter({ table: 'org_roles' });
export const getOrgRoles = listAdapter({ table: 'org_roles', selects: ['*', 'id AS role_id'] });
export const createOrgRole = createWithIdGenAdapter({ table: 'org_roles' });
export const updateOrgRole = updateAdapter({ table: 'org_roles' });
export const deleteOrgRole = deleteAdapter({ table: 'org_roles' });

export const getOrgRolesForOrgs = getManyRelationAdapter({
  table: 'org_roles',
  elemField: 'role_id',
  collectionField: 'org_id',
  selects: ['*', 'id AS role_id']
});

export const grantPermissionToOrgRole = createRelationAdapter({
  table: 'org_role_permission_bindings',
  elemField: 'permission_id',
  collectionField: 'role_id'
});
export const revokePermissionFromOrgRole = deleteRelationAdapter({
  table: 'org_role_permission_bindings',
  elemField: 'permission_id',
  collectionField: 'role_id'
});

export const getOrgRolesForPermissions = getManyRelationAdapter({
  table: 'org_role_permission_bindings',
  elemField: 'role_id',
  collectionField: 'permission_id'
});
export const getPermissionsForOrgRoles = getManyRelationAdapter({
  table: 'org_role_permission_bindings',
  elemField: 'permission_id',
  collectionField: 'role_id'
});

export const grantOrgRoleToUser = createRelationAdapter({
  table: 'org_role_user_bindings',
  elemField: 'role_id',
  collectionField: 'user_id'
});
export const revokeOrgRoleFromUser = deleteRelationAdapter({
  table: 'org_role_user_bindings',
  elemField: 'role_id',
  collectionField: 'user_id'
});

export const getOrgRolesForUsers = getManyRelationAdapter({
  table: 'org_role_user_bindings',
  elemField: 'role_id',
  collectionField: 'user_id'
});
export const getUsersForOrgRoles = getManyRelationAdapter({
  table: 'org_role_user_bindings',
  elemField: 'user_id',
  collectionField: 'role_id'
});

export async function getOrgRolesForUser(args, trx) {
  const rows = await getOrgRolesForUserSelector(args, trx);
  return camelizeKeys(rows);
}
export const getOrgRolesForUserSelector = selectAdapter({
  table: 'org_role_user_bindings AS UB',
  name: 'getOrgRolesForUserSelector',
  selects: ['r.id', 'r.name'],
  joins: [
    {
      table: 'org_roles AS r',
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

export async function getOrgRolesAndPermissionsForUser(args, trx) {
  let ret = await getOrgRolesAndPermissionsForUserSelector(args, trx);
  ret = camelizeKeys(ret);

  let oids = _.uniq(ret.map(elem => elem.orgId));
  let roles = orderedFor(ret, oids, 'orgId', false);

  let final = [];
  for (let oid of oids) {
    const orgRoles = roles.filter(elem => elem[0].orgId === oid);
    if (!orgRoles) {
      continue;
    }

    const orgName = orgRoles[0][0].orgName;
    let rs = [];
    for (let r of orgRoles) {
      let roleId = r[0].roleId;
      let roleName = r[0].roleName;
      rs.push({
        roleId,
        roleName,
        permissions: r
      });
    }

    let o = {
      orgId: oid,
      orgName: orgName,
      permissions: _.flatten(orgRoles),
      roles: rs
    };
    final.push(o);
  }

  return final;
}
export const getOrgRolesAndPermissionsForUserSelector = selectAdapter({
  table: 'orgs AS O',
  name: 'getOrgRolesAndPermissionsForUserSelector',
  selects: ['*', 'O.name AS orgName', 'OR.name AS roleName', 'P.name AS permissionName'],
  joins: [
    {
      table: 'org_roles AS OR',
      join: 'left',
      args: ['O.id', 'OR.org_id']
    },
    {
      table: 'org_role_user_bindings AS UB',
      join: 'left',
      args: ['OR.id', 'UB.role_id']
    },
    {
      table: 'org_role_permission_bindings AS PB',
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

/*
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
*/
