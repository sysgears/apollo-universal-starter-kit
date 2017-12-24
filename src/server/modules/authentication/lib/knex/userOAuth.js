import _ from 'lodash';
import { camelizeKeys } from 'humps';

import knex from '../../../../sql/connector';
import { orderedFor } from '../../../../sql/helpers';

import log from '../../../../../common/log';

export async function searchUserByOAuthIdOrEmail(provider, id, email, trx) {
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

export async function getUserFromOAuth(provider, oauth_id, trx) {
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

export async function getOAuthsForUsers(ids, trx) {
  try {
    let builder = knex
      .select('*')
      .from('user_oauths')
      .whereIn('user_id', ids);

    if (trx) {
      builder.transacting(trx);
    }

    let rows = await builder;

    let res = _.filter(rows, row => row.provider !== null);
    res = camelizeKeys(res);
    return orderedFor(res, ids, 'userId', false);
  } catch (e) {
    log.error('Error in Auth.getOAuthsForUsers', e);
    throw e;
  }
}

export async function getUserOAuths(providers, trx) {
  try {
    let builder = knex
      .select('*')
      .from('user_oauths')
      .whereIn('provider', providers);

    if (trx) {
      builder.transacting(trx);
    }

    let rows = await builder;

    let res = _.filter(rows, row => row.user_id !== null);
    res = camelizeKeys(res);
    return orderedFor(res, providers, 'provider', false);
  } catch (e) {
    log.error('Error in Auth.getUsersOAuths', e);
    throw e;
  }
}

export async function createUserOAuth(provider, oauthId, userId, trx) {
  try {
    let builder = knex('user_oauths').insert({
      provider: provider,
      oauth_id: oauthId,
      user_id: userId
    });

    if (trx) {
      builder.transacting(trx);
    }

    let ret = await builder;
    return ret;
  } catch (e) {
    log.error('Error in Auth.createUserOAuth', e);
    throw e;
  }
}

export async function deleteUserOAuth(provider, oauthId, userId, trx) {
  try {
    let builder = knex('user_oauths')
      .where({
        provider: provider,
        oauth_id: oauthId,
        user_id: userId
      })
      .delete();

    if (trx) {
      builder.transacting(trx);
    }

    let ret = await builder;
    return ret;
  } catch (e) {
    log.error('Error in Auth.deleteUserOAuth', e);
    throw e;
  }
}
