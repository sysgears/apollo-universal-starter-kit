import bcrypt from 'bcryptjs';
import uuidv4 from 'uuid';
import _ from 'lodash';
import { camelizeKeys } from 'humps';

import knex from '../../../sql/connector';
import { orderedFor } from '../../../sql/helpers';

import log from '../../../../common/log';

export default class Authn {
  async getUserWithPassword(id, trx) {
    try {
      let builder = knex
        .select('u.id', 'u.is_active', 'u.email', 'a.password')
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
      log.error('Error in Auth.getUserWithPassword', e);
      throw e;
    }
  }

  async getApiKeysForUsers(ids, trx) {
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
      log.error('Error in Auth.getApiKeysForUsers', e);
      throw e;
    }
  }

  async getCertificatesForUsers(ids, trx) {
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

  async getOAuthsForUsers(ids, trx) {
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

  async createPassword(id, plaintextPassword, trx) {
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

  async updatePassword(id, plaintextPassword, trx) {
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

  async createUserOAuth(provider, oauthId, userId, trx) {
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

  async deleteUserOAuth(provider, oauthId, userId, trx) {
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

  async createUserCertificate(id, name, serial, pubkey, trx) {
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

  async deleteUserCertificate(id, name, trx) {
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

  async createUserApiKey(id, name, trx) {
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
      log.error('Error in Auth.createUserApiKey', e);
      throw e;
    }
  }

  async deleteUserApiKey(id, name, trx) {
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
      log.error('Error in Auth.deleteUserApiKey', e);
      throw e;
    }
  }

  async getApiKeysForServiceAccounts(ids, trx) {
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

  async getCertificatesForServiceAccounts(ids, trx) {
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

  async createServiceAccountCertificate(id, name, serial, pubkey, trx) {
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

  async deleteServiceAccountCertificate(id, name, trx) {
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

  async createServiceAccountApiKey(id, name, trx) {
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

  async deleteServiceAccountApiKey(id, name, trx) {
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
}
