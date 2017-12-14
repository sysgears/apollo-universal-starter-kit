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

    let uuid = await User.create({
      email: newUser.email,
      isActive: newUser.isActive
    });
    console.log('Register - uuid', uuid);

    console.log('Register - profile');
    await User.createProfile(uuid, newUser.profile);

    console.log('Register - password');
    await this.createPassword(uuid, newUser.password);

    console.log('Register - role');
    await this.initUserRole(uuid, 'user');

    console.log('Register - user');
    const user = await User.get(uuid);

    console.log('Register - return', user);
    return user;
  }

  async searchUserByOAuthIdOrEmail(provider, id, email) {
    let row = await knex
      .select('u.uuid AS id', 'u.is_active', 'u.email', 'o.provider')
      .from('users AS u')
      .whereIn('u.email', email)
      .orWhere('provider', '=', provider)
      .leftJoin('user_oauths AS o', 'o.user_id', 'u.id')
      .first();

    return camelizeKeys(row);
  }

  async getUserWithPassword(uuid) {
    return knex
      .select('u.uuid As id', 'u.is_active', 'u.email', 'a.password', 'r.role')
      .from('users AS u')
      .whereIn('u.uuid', uuid)
      .leftJoin('user_password AS a', 'a.user_id', 'u.id')
      .leftJoin('user_roles AS r', 'r.user_id', 'a.user_id')
      .first();
  }

  async getUserWithApiKeys(uuid) {
    let rows = await knex
      .select('u.uuid AS id', 'u.is_active', 'u.email', 'a.name', 'a.key', 'r.role')
      .from('users AS u')
      .whereIn('u.uuid', uuid)
      .leftJoin('user_apikeys AS a', 'a.user_id', 'u.id')
      .leftJoin('user_roles AS r', 'r.user_id', 'u.id');

    let res = _.filter(rows, row => row.name !== null);
    return orderedFor(res, uuid, 'id', false);
  }

  async getUserWithSerials(uuid) {
    let rows = await knex
      .select('u.uuid AS id', 'u.is_active', 'u.email', 'a.name', 'a.serial', 'r.role')
      .from('users AS u')
      .whereIn('u.uuid', uuid)
      .leftJoin('user_certificates AS a', 'a.user_id', 'u.id')
      .leftJoin('user_roles AS r', 'r.user_id', 'u.id');

    let res = _.filter(rows, row => row.serial !== null);
    return orderedFor(res, uuid, 'id', false);
  }

  async getUserWithOAuths(uuid) {
    let rows = await knex
      .select('u.uuid AS id', 'u.is_active', 'u.email', 'a.provider', 'a.oauth_id AS oauth_id', 'r.role')
      .from('users AS u')
      .whereIn('u.uuid', uuid)
      .leftJoin('user_oauths AS a', 'a.user_id', 'u.id')
      .leftJoin('user_roles AS r', 'r.user_id', 'u.id');

    let res = _.filter(rows, row => row.provider !== null);
    return orderedFor(res, uuid, 'id', false);
  }

  async getUserPasswordFromEmail(email) {
    let row = await knex
      .select('u.uuid AS id', 'u.is_active', 'u.email', 'a.password', 'r.role')
      .from('users AS u')
      .whereIn('u.email', email)
      .leftJoin('user_password AS a', 'a.user_id', 'u.id')
      .leftJoin('user_roles AS r', 'r.user_id', 'u.id')
      .first();

    return camelizeKeys(row);
  }

  async getUserFromApiKey(apikey) {
    let row = await knex
      .select('u.uuid AS id', 'u.is_active', 'u.email', 'a.name')
      .from('users AS u')
      .leftJoin('user_apikeys AS a', 'a.user_id', 'u.id')
      .where('a.key', '=', apikey)
      .first();

    return camelizeKeys(row);
  }

  async getUserFromOAuth(provider, oauth_id) {
    let row = await knex
      .select('u.uuid AS id', 'u.is_active', 'u.email')
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
      .select('u.uuid AS id', 'u.is_active', 'u.email', 'a.name')
      .from('users AS u')
      .leftJoin('user_certificates AS a', 'a.user_id', 'u.id')
      .where('a.serial', '=', serial)
      .first();

    return camelizeKeys(row);
  }

  async createPassword(uuid, plaintextPassword) {
    const userId = await User.getInternalIdFromUUID(uuid);
    const password = await bcrypt.hash(plaintextPassword, 12);
    console.log('INIT PASS', userId, uuid);

    return knex('user_password').insert({
      user_id: userId,
      password: password
    });
  }

  async updatePassword(uuid, plaintextPassword) {
    const userId = await User.getInternalIdFromUUID(uuid);
    const password = await bcrypt.hash(plaintextPassword, 12);

    return knex('user_password')
      .insert({
        password: password
      })
      .where({
        user_id: userId
      });
  }

  async createUserOAuth(provider, id, userUUID) {
    let userId = await User.getInternalIdFromUUID(userUUID);
    return knex('user_oauths').insert({
      provider: provider,
      oauth_id: id,
      user_id: userId
    });
  }

  async deleteUserOAuth(provider, id, userUUID) {
    let userId = await User.getInternalIdFromUUID(userUUID);
    return knex('user_oauths')
      .where({
        provider: provider,
        oauth_id: id,
        user_id: userId
      })
      .delete();
  }

  async createUserApiKey(userUUID, name) {
    let userId = await User.getInternalIdFromUUID(userUUID);
    let key = uuidv4();
    return knex('user_apikeys')
      .returning('key')
      .insert({
        name: name,
        key: key,
        user_id: userId
      });
  }

  async deleteUserApiKey(userUUID, name) {
    let userId = await User.getInternalIdFromUUID(userUUID);
    return knex('user_oauths')
      .where({
        name: name,
        user_id: userId
      })
      .delete();
  }

  async initUserRole(uuid, role) {
    const userId = await User.getInternalIdFromUUID(uuid);
    console.log('INIT ROLE', userId, uuid);
    return knex('user_roles').insert({
      role: 'user',
      user_id: userId
    });
  }

  async setUserRole(uuid, role) {
    const userId = await User.getInternalIdFromUUID(uuid);

    return knex('user_roles')
      .update({
        role
      })
      .where({
        user_id: userId
      });
  }

  /*
  async createPassword(uuid, plaintextPassword) {
    const userId = await User.getInternalIdFromUUID(uuid);
    const password = await bcrypt.hash(plaintextPassword, 12);

    return knex('user_password')
      .insert({
        user_id: userId,
        password: password
      })
  }

  async updatePassword(uuid, plaintextPassword) {
    const userId = await User.getInternalIdFromUUID(uuid);
    const password = await bcrypt.hash(plaintextPassword, 12);

    return knex('user_password')
      .insert({
        password: password
      })
      .where({
        user_id: userId
      })
  }
  */
}
