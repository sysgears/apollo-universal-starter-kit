import _ from 'lodash';
import { camelizeKeys } from 'humps';
import uuidv4 from 'uuid';

import knex from '../../../../sql/connector';
import { orderedFor } from '../../../../sql/helpers';

import log from '../../../../../common/log';

export async function getUserFromApiKey(apikey, trx) {
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

export async function getApiKeysForUsers(ids, trx) {
  try {
    let builder = knex
      .select('*')
      .from('user_apikeys')
      .whereIn('user_id', ids);

    if (trx) {
      builder.transacting(trx);
    }

    let rows = await builder;

    let res = _.filter(rows, row => row.name !== null);
    res = camelizeKeys(res);
    return orderedFor(res, ids, 'userId', false);
  } catch (e) {
    log.error('Error in Authn.UserApikey.getApiKeysForUsers', e);
    throw e;
  }
}

export async function getUserApiKeys(ids, trx) {
  try {
    let builder = knex
      .select('*')
      .from('user_apikeys')
      .whereIn('key', ids);

    if (trx) {
      builder.transacting(trx);
    }

    let rows = await builder;

    let res = _.filter(rows, row => row.name !== null);
    res = camelizeKeys(res);
    return orderedFor(res, ids, 'key', false);
  } catch (e) {
    log.error('Error in Authn.UserApikey.getForUsersApiKeys', e);
    throw e;
  }
}

export async function createUserApiKey(id, name, trx) {
  try {
    let key = uuidv4();
    let builder = knex('user_apikeys')
      .returning('key')
      .insert({
        name: name,
        key: key,
        user_id: id
      });

    if (trx) {
      builder.transacting(trx);
    }

    let ret = await builder;
    return ret;
  } catch (e) {
    log.error('Error in Authn.UserApikey.createUserApiKey', e);
    throw e;
  }
}

export async function deleteUserApiKey(id, name, trx) {
  try {
    let builder = knex('user_apikeys')
      .where({
        name: name,
        user_id: id
      })
      .delete();

    if (trx) {
      builder.transacting(trx);
    }

    let ret = await builder;
    return ret;
  } catch (e) {
    log.error('Error in Authn.UserApikey.deleteUserApiKey', e);
    throw e;
  }
}
