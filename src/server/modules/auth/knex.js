/*eslint-disable no-unused-vars*/
import bcrypt from 'bcryptjs';
import { camelizeKeys } from 'humps';
import uuidv4 from 'uuid';
import _ from 'lodash';

import knex from '../../sql/connector';
import { orderedFor } from '../../sql/helpers';

import UserDAO from '../entities/user/lib';

const User = new UserDAO();

export default class Auth {
  async registerNewUser(newUser) {
    // really NEED a SQL transaction here ( Or at the level above? they shouldn't have to care though )

    let id = await User.create({
      email: newUser.email,
      isActive: newUser.isActive
    });

    if (newUser.profile) {
      await User.createProfile(id, newUser.profile);
    }

    await this.createPassword(id, newUser.password);

    let ret = await this.initUserRole(id, 'user');

    const user = await User.get(id);

    return user;
  }

  async searchUserByEmail(email) {
    let row = await knex
      .select('u.id', 'u.is_active', 'u.email')
      .from('users AS u')
      .whereIn('u.email', email)
      .first();

    return camelizeKeys(row);
  }

  async searchUserByOAuthIdOrEmail(provider, id, email) {
    let row = await knex
      .select('u.id', 'u.is_active', 'u.email', 'o.provider')
      .from('users AS u')
      .whereIn('u.email', email)
      .orWhere('provider', '=', provider)
      .leftJoin('user_oauths AS o', 'o.user_id', 'u.id')
      .first();

    return camelizeKeys(row);
  }

  async getUsersWithUserRoles(ids) {
    let rows = await knex
      .select('b.user_id', 'r.id AS role_id', 'r.name', 'p.resource', 'p.relation', 'p.verb')
      .from('user_role_user_bindings AS b')
      .whereIn('b.user_id', ids)
      .leftJoin('user_roles AS r', 'r.id', 'b.role_id')
      .leftJoin('user_role_permissions AS g', 'p.id', 'r.permission_id')
      .leftJoin('permissions AS p', 'p.id', 'r.permission_id');

    let res = _.filter(rows, row => row.name !== null);
    res = camelizeKeys(res);
    return orderedFor(res, ids, 'userId', false);
  }

  async getUserWithUserRolesPermissions(id) {
    let rows = await knex
      .select('r.id AS role_id', 'r.name', 'p.resource', 'p.relation', 'p.verb')
      .from('user_role_user_bindings AS b')
      .where('b.user_id', '=', id)
      .leftJoin('user_roles AS r', 'r.id', 'b.role_id')
      .leftJoin('user_role_permissions AS g', 'g.role_id', 'r.id')
      .leftJoin('permissions AS p', 'p.id', 'g.permission_id');
    console.log('ROWS:', rows);

    let res = _.filter(rows, row => row.role_id !== null);
    res = camelizeKeys(res);
    let ids = _.map(rows, row => row.roleId);
    ids = _.uniq(ids);
    console.log('gUW-URP:', ids, res);
    return orderedFor(res, ids, 'roleId', false);
  }

  async getUserWithGroupRolesPermissions(id) {
    let rows = await knex
      .select('r.id AS role_id', 'r.name', 'p.resource', 'p.relation', 'p.verb')
      .from('group_role_user_bindings AS b')
      .where('b.user_id', '=', id)
      .leftJoin('group_roles AS r', 'r.id', 'b.role_id')
      .leftJoin('group_role_permissions AS g', 'g.role_id', 'r.id')
      .leftJoin('permissions AS p', 'p.id', 'g.permission_id');
    console.log('ROWS:', rows);

    let res = _.filter(rows, row => row.role_id !== null);
    res = camelizeKeys(res);
    let ids = _.map(rows, row => row.roleId);
    ids = _.uniq(ids);
    console.log('gUW-GRP:', ids, res);
    return orderedFor(res, ids, 'roleId', false);
  }

  async getUserWithOrgRolesPermissions(id) {
    let rows = await knex
      .select('r.id AS role_id', 'r.name', 'p.resource', 'p.relation', 'p.verb')
      .from('org_role_user_bindings AS b')
      .where('b.user_id', '=', id)
      .leftJoin('org_roles AS r', 'r.id', 'b.role_id')
      .leftJoin('org_role_permissions AS g', 'g.role_id', 'r.id')
      .leftJoin('permissions AS p', 'p.id', 'g.permission_id');
    console.log('ROWS:', rows);

    let res = _.filter(rows, row => row.role_id !== null);
    res = camelizeKeys(res);
    let ids = _.map(rows, row => row.roleId);
    ids = _.uniq(ids);
    console.log('gUW-ORP:', ids, res);
    return orderedFor(res, ids, 'roleId', false);
  }

  async getUserWithPassword(id) {
    let row = await knex
      .select('u.id', 'u.is_active', 'u.email', 'a.password', 'r.role')
      .from('users AS u')
      .where('u.id', '=', id)
      .leftJoin('user_password AS a', 'a.user_id', 'u.id')
      .first();
    return camelizeKeys(row);
  }

  async getUsersWithApiKeys(ids) {
    let rows = await knex
      .select('u.id', 'u.is_active', 'u.email', 'a.name', 'a.key', 'r.role')
      .from('users AS u')
      .whereIn('u.id', ids)
      .leftJoin('user_apikeys AS a', 'a.user_id', 'u.id');

    let res = _.filter(rows, row => row.name !== null);
    res = camelizeKeys(res);
    return orderedFor(res, ids, 'id', false);
  }

  async getUsersWithSerials(ids) {
    let rows = await knex
      .select('u.id', 'u.is_active', 'u.email', 'a.name', 'a.serial', 'r.role')
      .from('users AS u')
      .whereIn('u.id', ids)
      .leftJoin('user_certificates AS a', 'a.user_id', 'u.id');

    let res = _.filter(rows, row => row.serial !== null);
    res = camelizeKeys(res);
    return orderedFor(res, ids, 'id', false);
  }

  async getUsersWithOAuths(ids) {
    let rows = await knex
      .select('u.id', 'u.is_active', 'u.email', 'a.provider', 'a.oauth_id AS oauth_id', 'r.role')
      .from('users AS u')
      .whereIn('u.id', ids)
      .leftJoin('user_oauths AS a', 'a.user_id', 'u.id');

    let res = _.filter(rows, row => row.provider !== null);
    res = camelizeKeys(res);
    return orderedFor(res, ids, 'id', false);
  }

  async getUserPasswordFromEmail(email) {
    console.log('Auth.getUserPasswordFromEmail', email);
    let row = await knex
      .select('u.id', 'u.is_active', 'u.email', 'a.password')
      .from('users AS u')
      .whereIn('u.email', email)
      .leftJoin('user_password AS a', 'a.user_id', 'u.id')
      .first();
    console.log('Auth.getUserPasswordFromEmail', row);

    return camelizeKeys(row);
  }

  async getUserFromApiKey(apikey) {
    let row = await knex
      .select('u.id', 'u.is_active', 'u.email', 'a.name')
      .from('users AS u')
      .leftJoin('user_apikeys AS a', 'a.user_id', 'u.id')
      .where('a.key', '=', apikey)
      .first();

    return camelizeKeys(row);
  }

  async getUserFromOAuth(provider, oauth_id) {
    let row = await knex
      .select('u.id', 'u.is_active', 'u.email')
      .from('users AS u')
      .leftJoin('user_oauths AS a', 'a.user_id', 'u.id')
      .where({
        provider,
        oauth_id
      })
      .first();

    return camelizeKeys(row);
  }

  async getUserFromSerial(serial) {
    // ???
    let row = await knex
      .select('u.id', 'u.is_active', 'u.email', 'a.name')
      .from('users AS u')
      .leftJoin('user_certificates AS a', 'a.user_id', 'u.id')
      .where('a.serial', '=', serial)
      .first();

    return camelizeKeys(row);
  }

  async createPassword(id, plaintextPassword) {
    const password = await bcrypt.hash(plaintextPassword, 12);

    return knex('user_password').insert({
      user_id: id,
      password: password
    });
  }

  async updatePassword(id, plaintextPassword) {
    const password = await bcrypt.hash(plaintextPassword, 12);

    return knex('user_password')
      .insert({
        password: password
      })
      .where({
        user_id: id
      });
  }

  async createUserOAuth(provider, oauthId, userId) {
    return knex('user_oauths').insert({
      provider: provider,
      oauth_id: oauthId,
      user_id: userId
    });
  }

  async deleteUserOAuth(provider, oauthId, userId) {
    return knex('user_oauths')
      .where({
        provider: provider,
        oauth_id: oauthId,
        user_id: userId
      })
      .delete();
  }

  async createUserApiKey(id, name) {
    let key = uuidv4();
    return knex('user_apikeys')
      .returning('key')
      .insert({
        name: name,
        key: key,
        user_id: id
      });
  }

  async deleteUserApiKey(id, name) {
    return knex('user_oauths')
      .where({
        name: name,
        user_id: id
      })
      .delete();
  }

  async initUserRole(id, role) {
    return knex('user_roles').insert({
      role: role,
      user_id: id
    });
  }

  async setUserRole(id, role) {
    return knex('user_roles')
      .update({
        role
      })
      .where({
        user_id: id
      });
  }
}
