import _ from 'lodash';
import { camelizeKeys } from 'humps';

import knex from '../../../../sql/connector';
import { orderedFor } from '../../../../sql/helpers';

import log from '../../../../../common/log';

export async function getCertificatesForServiceAccounts(ids, trx) {
  try {
    let builder = knex
      .select('*')
      .from('serviceaccount_certificates')
      .whereIn('serviceaccount_id', ids);

    if (trx) {
      builder.transacting(trx);
    }

    let rows = await builder;

    let res = _.filter(rows, row => row.serial !== null);
    res = camelizeKeys(res);
    return orderedFor(res, ids, 'serviceaccountId', false);
  } catch (e) {
    log.error('Error in Auth.getCertificatesForServiceAccounts', e);
    throw e;
  }
}

export async function getServiceAccountCertificates(ids, trx) {
  try {
    let builder = knex
      .select('*')
      .from('serviceaccount_certificates')
      .whereIn('serial', ids);

    if (trx) {
      builder.transacting(trx);
    }

    let rows = await builder;

    let res = _.filter(rows, row => row.serial !== null);
    res = camelizeKeys(res);
    return orderedFor(res, ids, 'serviceaccountId', false);
  } catch (e) {
    log.error('Error in Auth.getCertificatesForServiceAccounts', e);
    throw e;
  }
}

export async function createServiceAccountCertificate(id, name, serial, pubkey, trx) {
  try {
    let builder = knex('serviceaccount_certificates').insert({
      name,
      serial,
      pubkey,
      serviceaccount_id: id
    });

    if (trx) {
      builder.transacting(trx);
    }

    let ret = await builder;
    return ret;
  } catch (e) {
    log.error('Error in Auth.createServiceAccountCertificate', e);
    throw e;
  }
}

export async function deleteServiceAccountCertificate(id, name, trx) {
  try {
    let builder = knex('serviceaccount_certificate')
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
    log.error('Error in Auth.deleteServiceAccountCertificate', e);
    throw e;
  }
}
