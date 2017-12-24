import { camelizeKeys, decamelizeKeys } from 'humps';
import uuidv4 from 'uuid';

import log from '../../../../../common/log';
import knex from '../../../../sql/connector';

import paging from '../../../../sql/paging';
import ordering from '../../../../sql/ordering';
import filterBuilder from '../../../../sql/filters';
import joinBuilder from '../../../../sql/joins';

const selectFields = [
  'u.id AS user_id',
  'u.email',
  'u.created_at',
  'u.updated_at',
  'u.is_active',

  'p.created_at',
  'p.updated_at',
  'p.display_name',
  'p.title',
  'p.first_name',
  'p.middle_name',
  'p.last_name',
  'p.suffix',
  'p.locale',
  'p.language'
];

export default class User {
  async getFlex(args, trx) {
    try {
      let builder = knex.select('*', 'u.id AS userId').from('users AS u');

      // add filter conditions
      builder = joinBuilder(builder, args);

      // add filter conditions
      builder = filterBuilder(builder, args);

      // paging and ordering
      builder = paging(builder, args);
      builder = ordering(builder, args);

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return camelizeKeys(ret);
    } catch (e) {
      log.error('Error in User.getFlex', e);
      throw e;
    }
  }

  async list(args, trx) {
    try {
      let builder = knex
        .select(...selectFields)
        .from('users AS u')
        .leftJoin('user_profile AS p', 'p.user_id', 'u.id');

      // add filter conditions
      builder = filterBuilder(builder, args);

      // paging and ordering
      builder = paging(builder, args);
      builder = ordering(builder, args);

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;
      return camelizeKeys(rows);
    } catch (e) {
      log.error('Error in User.list', e);
      throw e;
    }
  }

  async get(id, trx) {
    try {
      let builder = knex
        .select(...selectFields)
        .from('users AS u')
        .where('u.id', '=', id)
        .leftJoin('user_profile AS p', 'p.user_id', 'u.id')
        .first();

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return camelizeKeys(ret);
    } catch (e) {
      log.error('Error in User.get', e);
      throw e;
    }
  }

  async getMany(args, trx) {
    try {
      let builder = knex
        .select(...selectFields)
        .from('users AS u')
        .whereIn('u.id', args.ids)
        .leftJoin('user_profile AS p', 'p.user_id', 'u.id');

      // add filter conditions
      builder = filterBuilder(builder, args);

      // paging and ordering
      builder = paging(builder, args);
      builder = ordering(builder, args);

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return camelizeKeys(ret);
    } catch (e) {
      log.error('Error in User.get', e);
      throw e;
    }
  }

  async getByEmail(email, trx) {
    try {
      let builder = knex
        .select(...selectFields)
        .from('users AS u')
        .where('u.email', '=', email)
        .leftJoin('user_profile AS p', 'p.user_id', 'u.id')
        .first();

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return camelizeKeys(ret);
    } catch (e) {
      log.error('Error in User.getByEmail', e);
      throw e;
    }
  }

  async create(values, trx) {
    try {
      values.id = uuidv4();

      let builder = knex('users').insert(decamelizeKeys(values));
      if (trx) {
        builder.transacting(trx);
      }

      await builder;
      return values.id;
    } catch (e) {
      log.error('Error in User.create', e);
      throw e;
    }
  }

  async update(id, values, trx) {
    try {
      let builder = knex('users')
        .where('id', '=', id)
        .update(decamelizeKeys(values));

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return ret;
    } catch (e) {
      log.error('Error in User.update', e);
      throw e;
    }
  }

  async delete(id, trx) {
    try {
      let builder = knex('users')
        .where('id', '=', id)
        .delete();

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return ret;
    } catch (e) {
      log.error('Error in User.delete', e);
      throw e;
    }
  }

  async getProfile(id, trx) {
    try {
      let builder = knex
        .select('*')
        .from('user_profile')
        .where('user_id', '=', id)
        .first();

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return camelizeKeys(ret);
    } catch (e) {
      log.error('Error in User.getProfile', e);
      throw e;
    }
  }

  async getProfileMany(args, trx) {
    try {
      let builder = knex
        .select('*')
        .from('user_profile')
        .whereIn('user_id', args.ids);

      // add filter conditions
      builder = filterBuilder(builder, args);

      // paging and ordering
      builder = paging(builder, args);
      builder = ordering(builder, args);

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return camelizeKeys(ret);
    } catch (e) {
      log.error('Error in User.getProfileMany', e);
      throw e;
    }
  }

  async createProfile(id, values, trx) {
    try {
      values.userId = id;

      let builder = knex('user_profile').insert(decamelizeKeys(values));
      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return ret;
    } catch (e) {
      log.error('Error in User.createProfile', e);
      throw e;
    }
  }

  async updateProfile(id, values, trx) {
    try {
      let builder = knex('user_profile')
        .where('user_id', '=', id)
        .update(decamelizeKeys(values));

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return ret;
    } catch (e) {
      log.error('Error in User.udpateProfile', e);
      throw e;
    }
  }

  async deleteProfile(id, trx) {
    try {
      let builder = knex('user_profile')
        .where('user_id', '=', id)
        .delete();

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return ret;
    } catch (e) {
      log.error('Error in User.deleteProfile', e);
      throw e;
    }
  }
}
