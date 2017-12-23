import _ from 'lodash';
import { camelizeKeys } from 'humps';

import knex from '../../../../sql/connector';
import { orderedFor } from '../../../../sql/helpers';

import log from '../../../../../common/log';

export async function getCertificatesForUsers(ids, trx) {
  try {
    let builder = knex
      .select('*')
      .from('user_certificates')
      .whereIn('user_id', ids);

    if (trx) {
      builder.transacting(trx);
    }

    let rows = await builder;

    let res = _.filter(rows, row => row.serial !== null);
    res = camelizeKeys(res);
    return orderedFor(res, ids, 'userId', false);
  } catch (e) {
    log.error('Error in Auth.getCertificatesForUsers', e);
    throw e;
  }
}

export async function getUserCertificates(ids, trx) {
  try {
    let builder = knex
      .select('*')
      .from('user_certificates')
      .whereIn('serial', ids);

    if (trx) {
      builder.transacting(trx);
    }

    let rows = await builder;

    let res = _.filter(rows, row => row.serial !== null);
    res = camelizeKeys(res);
    return orderedFor(res, ids, 'userId', false);
  } catch (e) {
    log.error('Error in Auth.getCertificatesForUsers', e);
    throw e;
  }
}

export async function createUserCertificate(id, name, serial, pubkey, trx) {
  try {
    let builder = knex('user_certificates').insert({
      name,
      serial,
      pubkey,
      user_id: id
    });

    if (trx) {
      builder.transacting(trx);
    }

    let ret = await builder;
    return ret;
  } catch (e) {
    log.error('Error in Auth.createUserCertificate', e);
    throw e;
  }
}

export async function deleteUserCertificate(id, name, trx) {
  try {
    let builder = knex('user_certificate')
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
    log.error('Error in Auth.deleteUserCertificate', e);
    throw e;
  }
}
