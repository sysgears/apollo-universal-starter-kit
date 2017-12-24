import { camelizeKeys } from 'humps';

import {
  listAdapter,
  findAdapter,
  createWithoutIdAdapter,
  updateMultiConditionAdapter,
  deleteMultiConditionAdapter,
  getManyRelationAdapter
} from '../../../../sql/crud';

import knex from '../../../../sql/connector';
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

export const searchUserOAuths = findAdapter('user_oauths');
export const getOAuthsForUsers = getManyRelationAdapter('user_oauths', {
  elemField: 'provider',
  collectionField: 'userId'
});
export const getUsersForOAuths = getManyRelationAdapter('user_oauths', {
  elemField: 'provider',
  collectionField: 'userId'
});

export const listUserOAuth = listAdapter('user_oauths');
export const createUserOAuth = createWithoutIdAdapter('user_oauths');
export const updateUserOAuth = updateMultiConditionAdapter('user_oauths');
export const deleteUserOAuth = deleteMultiConditionAdapter('user_oauths');
