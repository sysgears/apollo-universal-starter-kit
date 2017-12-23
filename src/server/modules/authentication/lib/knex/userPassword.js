/*eslint-disable no-unused-vars*/
import bcrypt from 'bcryptjs';
import { camelizeKeys } from 'humps';
import uuidv4 from 'uuid';
import _ from 'lodash';

import settings from '../../../../../../settings';
import log from '../../../../../common/log';

import knex from '../../../../sql/connector';
import { orderedFor } from '../../../../sql/helpers';

import User from '../../../entities/user/lib';

const entities = settings.entities;
const authn = settings.auth.authentication;
const authz = settings.auth.authorization;
const staticUserScopes = authz.userScopes;
const staticGroupScopes = authz.groupScopes;
const staticOrgScopes = authz.orgScopes;

export default class Auth {
  async registerNewUser(newUser) {
    try {
      let user = null;

      // Use a transaction during registration
      knex.transaction(trx => {
        // Finally wait on the transaction to complete, potentially rolling back
        this.registerUser(newUser)
          .then(createdUser => {
            user = createdUser;
          })
          .then(trx.commit)
          .catch(trx.rollback);
      });

      return user;
    } catch (e) {
      log.error('Error in Auth.registerNewUser', e);
      throw e;
    }
  }

  async registerUser(newUser, trx) {
    try {
      const id = await User.create(
        {
          email: newUser.email,
          isActive: newUser.isActive
        },
        trx
      );

      if (newUser.profile) {
        await User.createProfile(id, newUser.profile, trx);
      }

      await this.createPassword(id, newUser.password, trx);

      // let ret = await this.createUserRole(id, 'user');

      const user = await User.get(id, trx);

      return user;
    } catch (e) {
      log.error('Error in Auth.searchUserByEmail', e);
      throw e;
    }
  }

  async searchUserByEmail(email, trx) {
    try {
      let builder = knex
        .select('u.id', 'u.is_active', 'u.email')
        .from('users AS u')
        .whereIn('u.email', email)
        .first();

      if (trx) {
        builder.transacting(trx);
      }

      let row = await builder;

      return camelizeKeys(row);
    } catch (e) {
      log.error('Error in Auth.searchUserByEmail', e);
      throw e;
    }
  }

  async searchUserByOAuthIdOrEmail(provider, id, email, trx) {
    try {
      let builder = knex
        .select('u.id', 'u.is_active', 'u.email', 'o.provider')
        .from('users AS u')
        .whereIn('u.email', email)
        .orWhere('provider', '=', provider)
        .leftJoin('user_oauths AS o', 'o.user_id', 'u.id')
        .first();

      if (trx) {
        builder.transacting(trx);
      }

      let row = await builder;

      return camelizeKeys(row);
    } catch (e) {
      log.error('Error in Auth.searchUserByOAuthIdOrEmail', e);
      throw e;
    }
  }

  async getUserPasswordFromEmail(email, trx) {
    try {
      console.log('Auth.getUserPasswordFromEmail', email);
      let builder = knex
        .select('u.id', 'u.is_active', 'u.email', 'a.password')
        .from('users AS u')
        .whereIn('u.email', email)
        .leftJoin('user_password AS a', 'a.user_id', 'u.id')
        .first();

      if (trx) {
        console.log('transacting!');
        builder.transacting(trx);
      }

      let row = await builder;

      let ret = camelizeKeys(row);
      return ret;
    } catch (e) {
      log.error('Error in Auth.getUserPasswordFromEmail', e);
      throw e;
    }
  }

  async getUserFromApiKey(apikey, trx) {
    try {
      let builder = knex
        .select('u.id', 'u.is_active', 'u.email', 'a.name')
        .from('users AS u')
        .leftJoin('user_apikeys AS a', 'a.user_id', 'u.id')
        .where('a.key', '=', apikey)
        .first();

      if (trx) {
        builder.transacting(trx);
      }

      let row = await builder;

      return camelizeKeys(row);
    } catch (e) {
      log.error('Error in Auth.getUserFromApiKey', e);
      throw e;
    }
  }

  async getUserFromOAuth(provider, oauth_id, trx) {
    try {
      let builder = knex
        .select('u.id', 'u.is_active', 'u.email')
        .from('users AS u')
        .leftJoin('user_oauths AS a', 'a.user_id', 'u.id')
        .where({
          provider,
          oauth_id
        })
        .first();

      if (trx) {
        builder.transacting(trx);
      }

      let row = await builder;

      return camelizeKeys(row);
    } catch (e) {
      log.error('Error in Auth.getUserFromOAuth', e);
      throw e;
    }
  }

  async getUserFromSerial(serial, trx) {
    try {
      // ??? (Same as and ApiKey?) Maybe this should be public/private key pairs?
      let builder = knex
        .select('u.id', 'u.is_active', 'u.email', 'a.name')
        .from('users AS u')
        .leftJoin('user_certificates AS a', 'a.user_id', 'u.id')
        .where('a.serial', '=', serial)
        .first();

      if (trx) {
        builder.transacting(trx);
      }

      let row = await builder;

      return camelizeKeys(row);
    } catch (e) {
      log.error('Error in Auth.getUserFromSerial', e);
      throw e;
    }
  }

  async getUserWithUserRolesPermissions(id, trx) {
    try {
      let builder = knex
        .select('r.id AS role_id', 'r.name', 'p.resource', 'p.relation', 'p.verb')
        .from('user_role_user_bindings AS b')
        .where('b.user_id', '=', id)
        .leftJoin('user_roles AS r', 'r.id', 'b.role_id')
        .leftJoin('user_role_permission_bindings AS g', 'g.role_id', 'r.id')
        .leftJoin('permissions AS p', 'p.id', 'g.permission_id');

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;

      let res = _.filter(rows, r => r.role_id !== null);
      res = camelizeKeys(res);
      let ids = _.map(res, r => r.roleId);
      ids = _.uniq(ids);
      return orderedFor(res, ids, 'roleId', false);
    } catch (e) {
      log.error('Error in Auth.getUserWithUserRolesPermissions', e);
      throw e;
    }
  }

  async getUserWithGroupRolesPermissions(id, trx) {
    try {
      let builder = knex
        .select('r.id AS role_id', 'r.name', 'p.resource', 'p.relation', 'p.verb')
        .from('group_role_user_bindings AS b')
        .where('b.user_id', '=', id)
        .leftJoin('group_roles AS r', 'r.id', 'b.role_id')
        .leftJoin('group_role_permission_bindings AS g', 'g.role_id', 'r.id')
        .leftJoin('permissions AS p', 'p.id', 'g.permission_id');

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;
      console.log('ROWS:', rows);

      let res = _.filter(rows, row => row.role_id !== null);
      res = camelizeKeys(res);
      let ids = _.map(res, r => r.roleId);
      ids = _.uniq(ids);
      console.log('gUW-GRP:', ids, res);
      return orderedFor(res, ids, 'roleId', false);
    } catch (e) {
      log.error('Error in Auth.getUserWithGroupRolesPermissions', e);
      throw e;
    }
  }

  async getUserWithOrgRolesPermissions(id, trx) {
    try {
      let builder = knex
        .select('r.id AS role_id', 'r.name', 'p.resource', 'p.relation', 'p.verb')
        .from('org_role_user_bindings AS b')
        .where('b.user_id', '=', id)
        .leftJoin('org_roles AS r', 'r.id', 'b.role_id')
        .leftJoin('org_role_permission_bindings AS g', 'g.role_id', 'r.id')
        .leftJoin('permissions AS p', 'p.id', 'g.permission_id');

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;
      console.log('ROWS:', rows);

      let res = _.filter(rows, row => row.role_id !== null);
      res = camelizeKeys(res);
      let ids = _.map(rows, row => row.roleId);
      ids = _.uniq(ids);
      console.log('gUW-ORP:', ids, res);
      return orderedFor(res, ids, 'roleId', false);
    } catch (e) {
      log.error('Error in Auth.getUserWithOrgRolesPermissions', e);
      throw e;
    }
  }

  // Plural version for multiple "Users" ids
  async getUsersWithUserRoles(ids, trx) {
    try {
      let builder = knex
        .select('b.user_id', 'r.id AS role_id', 'r.name')
        .from('user_role_user_bindings AS b')
        .whereIn('b.user_id', ids)
        .leftJoin('user_roles AS r', 'r.id', 'b.role_id');

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;

      let res = _.filter(rows, r => r.name !== null);
      res = camelizeKeys(res);
      return orderedFor(res, ids, 'userId', false);
    } catch (e) {
      log.error('Error in Auth.getUsersWithUserRoles', e);
      throw e;
    }
  }

  async getRolesForGroups(ids, trx) {
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
      return orderedFor(res, ids, 'groupId', false);
    } catch (e) {
      log.error('Error in Auth.getRolesForGroups', e);
      throw e;
    }
  }

  async getRolesForOrgs(ids, trx) {
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
      log.error('Error in Auth.getRolesForOrgs', e);
      throw e;
    }
  }
}
