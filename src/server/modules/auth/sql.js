/*eslint-disable no-unused-vars*/
import bcrypt from 'bcryptjs';
import { camelizeKeys } from 'humps';
import uuidv4 from 'uuid';
import _ from 'lodash';

import knex from '../../sql/connector';
import { orderedFor } from '../../sql/helpers';

import UserDAO from '../entities/user';

const User = new UserDAO();

export default class Auth {
  async registerNewUser(newUser) {
    // really NEED a SQL transaction here
    console.log('Register - input', newUser);

    let id = await User.create({
      email: newUser.email,
      isActive: newUser.isActive
    });
    console.log('Register - id', id);

    if (newUser.profile) {
      console.log('Register - profile');
      await User.createProfile(id, newUser.profile);
    }

    console.log('Register - password');
    await this.createPassword(id, newUser.password);

    let ret = await this.initUserRole(id, 'user');
    console.log('Register - role', ret);

    console.log('Register - user');
    const user = await User.get(id);

    console.log('Register - return', user);
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

  async getUserWithPassword(id) {
    return knex
      .select('u.id', 'u.is_active', 'u.email', 'a.password', 'r.role')
      .from('users AS u')
      .whereIn('u.id', id)
      .leftJoin('user_password AS a', 'a.user_id', 'u.id')
      .leftJoin('user_roles AS r', 'r.user_id', 'a.user_id')
      .first();
  }

  async getUserWithApiKeys(id) {
    let rows = await knex
      .select('u.id', 'u.is_active', 'u.email', 'a.name', 'a.key', 'r.role')
      .from('users AS u')
      .whereIn('u.id', id)
      .leftJoin('user_apikeys AS a', 'a.user_id', 'u.id')
      .leftJoin('user_roles AS r', 'r.user_id', 'a.user_id');

    let res = _.filter(rows, row => row.name !== null);
    return orderedFor(res, id, 'id', false);
  }

  async getUserWithSerials(id) {
    let rows = await knex
      .select('u.id', 'u.is_active', 'u.email', 'a.name', 'a.serial', 'r.role')
      .from('users AS u')
      .whereIn('u.id', id)
      .leftJoin('user_certificates AS a', 'a.user_id', 'u.id')
      .leftJoin('user_roles AS r', 'r.user_id', 'a.user_id');

    let res = _.filter(rows, row => row.serial !== null);
    return orderedFor(res, id, 'id', false);
  }

  async getUserWithOAuths(id) {
    let rows = await knex
      .select('u.id', 'u.is_active', 'u.email', 'a.provider', 'a.oauth_id AS oauth_id', 'r.role')
      .from('users AS u')
      .whereIn('u.id', id)
      .leftJoin('user_oauths AS a', 'a.user_id', 'u.id')
      .leftJoin('user_roles AS r', 'r.user_id', 'a.user_id');

    let res = _.filter(rows, row => row.provider !== null);
    return orderedFor(res, id, 'id', false);
  }

  async getUserPasswordFromEmail(email) {
    console.log('Auth.getUserPasswordFromEmail', email);
    let row = await knex
      .select('u.id', 'u.is_active', 'u.email', 'a.password', 'r.role')
      .from('users AS u')
      .leftJoin('user_password AS a', 'a.user_id', 'u.id')
      .leftJoin('user_roles AS r', 'r.user_id', 'a.user_id')
      .whereIn('u.email', email)
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
