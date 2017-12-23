import _ from 'lodash';
import { camelizeKeys } from 'humps';

import knex from '../../../../sql/connector';
import { orderedFor } from '../../../../sql/helpers';

import log from '../../../../../common/log';

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
