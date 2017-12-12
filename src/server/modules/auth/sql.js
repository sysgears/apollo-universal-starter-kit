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
    return knex
      .select('u.uuid', 'a.is_active', 'u.email', 'p.password')
      .from('users AS u')
      .whereIn('u.uuid', uuid)
      .leftJoin('user_password AS a', 'a.user_id', 'u.id')
      .first();
  }

  async getUserWithApiKeys(uuid) {
    let rows = await knex
      .select('u.uuid AS userId', 'u.is_active', 'u.email', 'a.name', 'a.key')
      .from('users AS u')
      .whereIn('u.uuid', uuid)
      .leftJoin('user_apikeys AS a', 'a.user_id', 'u.id');

    let res = _.filter(rows, row => row.name !== null);
    return orderedFor(res, uuid, 'userId', false);
  }

  async getUserWithSerials(uuid) {
    let rows = await knex
      .select('u.uuid AS userId', 'u.is_active', 'u.email', 'a.name', 'a.serial')
      .from('users AS u')
      .whereIn('u.uuid', uuid)
      .leftJoin('user_certificates AS a', 'a.user_id', 'u.id');

    let res = _.filter(rows, row => row.serial !== null);
    return orderedFor(res, uuid, 'userId', false);
  }

  async getUserWithOAuths(uuid) {
    let rows = await knex
      .select('u.uuid AS userId', 'u.is_active', 'u.email', 'a.provider', 'a.oauth_id AS oauth_id')
      .from('users AS u')
      .whereIn('u.uuid', uuid)
      .leftJoin('user_oauths AS a', 'a.user_id', 'u.id');

    let res = _.filter(rows, row => row.provider !== null);
    return orderedFor(res, uuid, 'userId', false);
  }

  async getUserPasswordFromEmail(email) {
    let rows = await knex
      .select('u.uuid', 'a.is_active', 'u.email', 'p.password')
      .from('users AS u')
      .whereIn('u.email', email)
      .leftJoin('user_password AS a', 'a.user_id', 'u.id')
      .first();
  }

  async getUserFromApiKey(apikey) {
    return camelizeKeys(
      await knex
        .select('u.uuid', 'u.id', 'u.is_active', 'u.email', 'a.name')
        .from('users AS u')
        .leftJoin('user_apikeys AS a', 'a.user_id', 'u.id')
        .where('a.key', '=', apikey)
        .first()
    );
  }

  async getUserFromOAuth(provider, oauth_id) {
    return camelizeKeys(
      await knex
        .select('u.uuid', 'u.id', 'u.is_active', 'u.email')
        .from('users AS u')
        .leftJoin('user_oauths AS a', 'a.user_id', 'u.id')
        .where({
          provider,
          oauth_id
        })
        .first()
    );
  }

  async getUserFromSerial(serial) {
    // ???
    return camelizeKeys(
      await knex
        .select('u.uuid', 'u.id', 'u.is_active', 'u.email', 'a.name')
        .from('users AS u')
        .leftJoin('user_certificates AS a', 'a.user_id', 'u.id')
        .where('a.serial', '=', serial)
        .first()
    );
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
