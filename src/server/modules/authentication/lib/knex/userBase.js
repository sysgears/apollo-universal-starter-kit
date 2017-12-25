import bcrypt from 'bcryptjs';
import { camelizeKeys } from 'humps';

import knex from '../../../../stores/sql/knex/client';
import log from '../../../../../common/log';

export async function getUserWithPassword(id, trx) {
  try {
    let builder = knex
      .select('*')
      .from('users AS u')
      .where('u.id', '=', id)
      .leftJoin('user_password AS a', 'a.user_id', 'u.id')
      .first();

    if (trx) {
      builder.transacting(trx);
    }

    let row = await builder;

    return camelizeKeys(row);
  } catch (e) {
    log.error('Error in Authn.Base.getUserWithPassword', e);
    throw e;
  }
}

export async function createPassword(id, plaintextPassword, trx) {
  try {
    const password = await bcrypt.hash(plaintextPassword, 12);

    let builder = knex('user_password').insert({
      user_id: id,
      password: password
    });

    if (trx) {
      builder.transacting(trx);
    }

    let ret = await builder;
    return ret;
  } catch (e) {
    log.error('Error in Auth.createPassword', e);
    throw e;
  }
}

export async function updatePassword(id, plaintextPassword, trx) {
  try {
    const password = await bcrypt.hash(plaintextPassword, 12);

    let builder = knex('user_password')
      .update({
        password: password
      })
      .where({
        user_id: id
      });

    if (trx) {
      builder.transacting(trx);
    }

    let ret = await builder;
    return ret;
  } catch (e) {
    log.error('Error in Auth.updatePassword', e);
    throw e;
  }
}
