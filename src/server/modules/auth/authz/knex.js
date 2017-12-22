import _ from 'lodash';
import { camelizeKeys } from 'humps';

import knex from '../../../sql/connector';
import { orderedFor } from '../../../sql/helpers';

import log from '../../../../common/log';
import settings from '../../../../../settings';

const entities = settings.entities;
const authz = settings.auth.authorization;
const staticUserScopes = authz.userScopes;
const staticGroupScopes = authz.groupScopes;
const staticOrgScopes = authz.orgScopes;

export default class Authz {
  // async getOrgRoles(id, trx) {}

  async getOrgRolesForOrgs(ids, trx) {
    try {
      let builder = knex
        .select('*')
        .from('org_roles')
        .whereIn('org_id', ids);

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;

      let res = _.filter(rows, r => r.name !== null);
      res = camelizeKeys(res);
      return orderedFor(res, ids, 'orgId', false);
    } catch (e) {
      log.error('Error in Authz.getOrgRolesForOrgs', e);
      throw e;
    }
  }

  async getGroupRolesForGroups(ids, trx) {
    try {
      let builder = knex
        .select('*')
        .from('group_roles')
        .whereIn('group_id', ids);

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;

      let res = _.filter(rows, r => r.name !== null);
      res = camelizeKeys(res);
      res = orderedFor(res, ids, 'groupId', false);
      return res;
    } catch (e) {
      log.error('Error in Authz.getGroupRolesForGroups', e);
      throw e;
    }
  }

  async getUserRolesForUsers(ids, trx) {
    try {
      // console.log("Authz.getUserRolesForUsers - ids", ids)

      let builder = await knex
        .select('b.user_id', 'b.role_id', 'r.name AS roleName')
        .from('user_role_user_bindings AS b')
        .whereIn('b.user_id', ids)
        .leftJoin('user_roles AS r', 'r.id', 'b.role_id');

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;
      // console.log("Authz.getUserRolesForUsers - rows", rows)

      let res = _.filter(rows, r => r.id !== null);
      res = camelizeKeys(res);
      // console.log("Authz.getUserRolesForUsers - res", res)
      let ret = orderedFor(res, ids, 'userId', false);
      // console.log("Authz.getUserRolesForUsers - ret", ret)
      return ret;
    } catch (e) {
      log.error('Error in Authz.getUserRolesForUsers', e);
      throw e;
    }
  }

  async getGroupRolesForUsers(ids, groupIds, trx) {
    try {
      // console.log("Authz.getGroupRolesForUsers - ids", ids, groupIds)

      let builder = await knex
        .select('b.user_id', 'b.role_id', 'r.group_id as groupId', 'r.name AS roleName', 'g.name AS groupName')
        .from('group_role_user_bindings AS b')
        .whereIn('b.user_id', ids)
        .leftJoin('group_roles AS r', 'r.id', 'b.role_id')
        .leftJoin('groups AS g', 'r.group_id', 'g.id');

      if (groupIds) {
        builder.whereIn('r.group_id', groupIds);
      }

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;

      let res = _.filter(rows, r => r.role_id !== null);
      res = camelizeKeys(res);
      // console.log("Authz.getGroupRolesForUsers - res", res)

      let ret = orderedFor(res, ids, 'userId', false);
      // console.log("Authz.getGroupRolesForUsers - ret", ret)

      let real = [];
      for (let ugr of ret) {
        let gis = _.map(ugr, u => u.groupId);
        let ugs = orderedFor(ugr, gis, 'groupId', false);
        // console.log(" - ugr", ugr, gis, ugs)
        real.push({
          userId: ugr[0].userId,
          groupId: ugr[0].groupId,
          groupName: ugr[0].groupName,
          roles: _.map(ugs, r => {
            r.roleName, r.roleId;
          })
        });
      }
      // console.log("Authz.getGroupRolesForUsers - real", real)
      return real;
    } catch (e) {
      log.error('Error in Authz.getGroupRolesGorUser', e);
      throw e;
    }
  }

  async getOrgRolesForUsers(ids, orgIds, trx) {
    try {
      // console.log("Authz.getOrgRolesForUsers - ids", ids, orgIds)

      let builder = await knex
        .select('b.user_id', 'b.role_id', 'r.org_id', 'r.name AS roleName', 'o.name AS orgName')
        .from('org_role_user_bindings AS b')
        .where('b.user_id', ids)
        .leftJoin('org_roles AS r', 'r.id', 'b.role_id')
        .leftJoin('orgs AS o', 'r.org_id', 'o.id');

      if (orgIds) {
        builder.whereIn('r.orgId', orgIds);
      }

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;

      let res = _.filter(rows, r => r.name !== null);
      res = camelizeKeys(res);
      // console.log("Authz.getOrgRolesForUsers - res", res)

      let ret = orderedFor(res, ids, 'userId', false);
      // console.log("Authz.getUserRolesForUsers - ret", ret)
      return ret;
    } catch (e) {
      log.error('Error in Authz.getUserWithOrgRoles', e);
      throw e;
    }
  }

  async getAllRolesForUsers(id, trx) {
    // TODO replace the following with a call to replace static scope lookup with a dynamic one
    // // ALSO, make this configurable, static or dynamic role/permission sets

    let groupRoles = null;
    let orgRoles = null;

    let userRoles = await this.getUserRolesForUsers(id, trx);
    for (let role of userRoles) {
      const scopes = staticUserScopes[role.name];
      role.scopes = scopes;
      userRoles[role.name] = role;
    }

    if (entities.groups.enabled) {
      groupRoles = await this.getGroupRolesForUsers(id, trx);
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
      orgRoles = await this.getOrgRolesForUsers(id, trx);
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

  async getUserRolesForUser(id, trx) {
    // console.log("Authz.getUserRolesForUser - in", id, typeof id)
    if (typeof id !== 'string') {
      id = id[0];
    }
    // console.log("Authz.getUserRolesForUser - id", id)
    try {
      let builder = await knex
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

  async getGroupRolesForUser(id, trx) {
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
      // console.log("Authz.getGroupRolesForUser - res", res)

      /*
      let ret = {};
      for (let r of res) {
        let cur = ret[r.groupId];
        if (!cur) {
          cur = {
            groupId: r.groupId,
            groupName: r.groupName,
            roles: {}
          };
        }
        cur.roles[r.name] = {
          name: r.name,
          id: r.roleId
        };
        ret[cur.groupId] = cur;
      }
      */

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

      // console.log("Authz.getGroupRolesForUser - ret", ret)

      let real = [];
      for (let key in ret) {
        real.push(ret[key]);
      }

      // console.log("Authz.getGroupRolesForUser - real", real)
      return real;
    } catch (e) {
      log.error('Error in Authz.getGroupRolesForUser', e);
      throw e;
    }
  }

  async getOrgRolesForUser(id, trx) {
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

  async getAllRolesForUser(id, trx) {
    // TODO replace the following with a call to replace static scope lookup with a dynamic one
    // // ALSO, make this configurable, static or dynamic role/permission sets

    let groupRoles = null;
    let orgRoles = null;

    let userRoles = await this.getUserRolesForUser(id, trx);
    for (let role of userRoles) {
      const scopes = staticUserScopes[role.name];
      role.scopes = scopes;
      userRoles[role.name] = role;
    }

    if (entities.groups.enabled) {
      groupRoles = await this.getGroupRolesForUser(id, trx);
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
      orgRoles = await this.getOrgRolesForUser(id, trx);
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
}
