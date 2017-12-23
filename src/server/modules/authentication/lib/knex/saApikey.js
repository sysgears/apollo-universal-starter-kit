import _ from 'lodash';
import { camelizeKeys } from 'humps';
import uuidv4 from 'uuid';

import knex from '../../../../sql/connector';
import { orderedFor } from '../../../../sql/helpers';

import log from '../../../../../common/log';

export async function getApiKeysForServiceAccounts(ids, trx) {
  try {
    let builder = knex
      .select('*')
      .from('serviceaccount_apikeys')
      .whereIn('serviceaccount_id', ids);

    if (trx) {
      builder.transacting(trx);
    }

    let rows = await builder;

    let res = _.filter(rows, row => row.name !== null);
    res = camelizeKeys(res);
    return orderedFor(res, ids, 'serviceaccountId', false);
  } catch (e) {
    log.error('Error in Auth.getApiKeysForServiceAccounts', e);
    throw e;
  }
}

export async function getServiceAccountApiKeys(ids, trx) {
  try {
    let builder = knex
      .select('*')
      .from('serviceaccount_apikeys')
      .whereIn('key', ids);

    if (trx) {
      builder.transacting(trx);
    }

    let rows = await builder;

    let res = _.filter(rows, row => row.name !== null);
    res = camelizeKeys(res);
    return orderedFor(res, ids, 'serviceaccountId', false);
  } catch (e) {
    log.error('Error in Auth.getApiKeysForServiceAccounts', e);
    throw e;
  }
}

export async function createServiceAccountApiKey(id, name, trx) {
  try {
    let key = uuidv4();
    let builder = knex('serviceaccount_apikeys')
      .returning('key')
      .insert({
        name: name,
        key: key,
        serviceaccount_id: id
      });

    if (trx) {
      builder.transacting(trx);
    }

    let ret = await builder;
    return ret;
  } catch (e) {
    log.error('Error in Auth.createServiceAccountApiKey', e);
    throw e;
  }
}

export async function deleteServiceAccountApiKey(id, name, trx) {
  try {
    let builder = knex('serviceaccount_apikeys')
      .where({
        name: name,
        serviceaccount_id: id
      })
      .delete();

    if (trx) {
      builder.transacting(trx);
    }

    let ret = await builder;
    return ret;
  } catch (e) {
    log.error('Error in Auth.deleteServiceAccountApiKey', e);
    throw e;
  }
}
