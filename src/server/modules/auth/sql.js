/*eslint-disable no-unused-vars*/
import { camelizeKeys } from 'humps';
import uuidv4 from 'uuid';
import _ from 'lodash';

import knex from '../../sql/connector';
import { orderedFor } from '../../sql/helpers';

import User from '../entities/user';

export default class Auth {
  async getUserAuth(id) {}

  async searchUserAuth(email, oauthProvider, oauthId) {}

  async searchUserByOAuthIdOrEmail(provider, id, email) {}

  async getUserWithPassword(uuid) {
    console.log('UUID', uuid);
    return knex
      .select('u.uuid As userId', 'u.is_active', 'u.email', 'a.password', 'r.role')
      .from('users AS u')
      .whereIn('u.uuid', uuid)
      .leftJoin('user_password AS a', 'a.user_id', 'u.id')
      .leftJoin('user_roles AS r', 'r.user_id', 'a.user_id')
      .first();
  }

  async getUserWithApiKeys(uuid) {
    let rows = await knex
      .select('u.uuid AS userId', 'u.is_active', 'u.email', 'a.name', 'a.key', 'r.role')
      .from('users AS u')
      .whereIn('u.uuid', uuid)
      .leftJoin('user_apikeys AS a', 'a.user_id', 'u.id')
      .leftJoin('user_roles AS r', 'r.user_id', 'u.id');

    let res = _.filter(rows, row => row.name !== null);
    return orderedFor(res, uuid, 'userId', false);
  }

  async getUserWithSerials(uuid) {
    let rows = await knex
      .select('u.uuid AS userId', 'u.is_active', 'u.email', 'a.name', 'a.serial', 'r.role')
      .from('users AS u')
      .whereIn('u.uuid', uuid)
      .leftJoin('user_certificates AS a', 'a.user_id', 'u.id')
      .leftJoin('user_roles AS r', 'r.user_id', 'u.id');

    let res = _.filter(rows, row => row.serial !== null);
    return orderedFor(res, uuid, 'userId', false);
  }

  async getUserWithOAuths(uuid) {
    let rows = await knex
      .select('u.uuid AS userId', 'u.is_active', 'u.email', 'a.provider', 'a.oauth_id AS oauth_id', 'r.role')
      .from('users AS u')
      .whereIn('u.uuid', uuid)
      .leftJoin('user_oauths AS a', 'a.user_id', 'u.id')
      .leftJoin('user_roles AS r', 'r.user_id', 'u.id');

    let res = _.filter(rows, row => row.provider !== null);
    return orderedFor(res, uuid, 'userId', false);
  }

  async getUserPasswordFromEmail(email) {
    console.log('Get User From Email');
    let row = await knex
      .select('u.uuid As userId', 'u.is_active', 'u.email', 'a.password', 'r.role')
      .from('users AS u')
      .whereIn('u.email', email)
      .leftJoin('user_password AS a', 'a.user_id', 'u.id')
      .leftJoin('user_roles AS r', 'r.user_id', 'u.id')
      .first();

    return camelizeKeys(row);
  }

  async getUserFromApiKey(apikey) {
    let row = await knex
      .select('u.uuid', 'u.id', 'u.is_active', 'u.email', 'a.name')
      .from('users AS u')
      .leftJoin('user_apikeys AS a', 'a.user_id', 'u.id')
      .where('a.key', '=', apikey)
      .first();

    return camelizeKeys(row);
  }

  async getUserFromOAuth(provider, oauth_id) {
    let row = await knex
      .select('u.uuid', 'u.id', 'u.is_active', 'u.email')
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
      .select('u.uuid', 'u.id', 'u.is_active', 'u.email', 'a.name')
      .from('users AS u')
      .leftJoin('user_certificates AS a', 'a.user_id', 'u.id')
      .where('a.serial', '=', serial)
      .first();

    return camelizeKeys(row);
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
}
