import { camelizeKeys, decamelizeKeys, decamelize } from 'humps';
import { has, _ } from 'lodash';
import uuidv4 from 'uuid';

import log from '../../../../common/log';
import knex from '../../../sql/connector';

/*
const userFields = ['u.uuid AS id', 'u.email', 'u.created_at', 'u.updated_at', 'u.is_active'];

const profileFields = [
  'p.display_name',
  'p.title',
  'p.first_name',
  'p.middle_name',
  'p.last_name',
  'p.suffix',
  'p.locale',
  'p.language'
];
*/

const selectFields = [
  'u.id',
  'u.email',
  'u.created_at',
  'u.updated_at',
  'u.is_active',
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
  async list(args, trx) {
    try {
      let { filters, orderBys, offset, limit } = args;

      const queryBuilder = knex
        .select(...selectFields)
        .from('users AS u')
        .leftJoin('user_profile AS p', 'p.user_id', 'u.id');

      // add filter conditions
      if (filters) {
        for (let filter of filters) {
          if (has(filter, 'isActive') && filter.isActive !== null) {
            queryBuilder.where(function() {
              this.where('u.is_active', filter.isActive);
            });
          }

          if (has(filter, 'searchText') && filter.searchText !== '') {
            queryBuilder.where(function() {
              this.where('u.email', 'like', `%${filter.searchText}%`)
                .orWhere('p.display_name', 'like', `%${filter.searchText}%`)
                .orWhere('p.first_name', 'like', `%${filter.searchText}%`)
                .orWhere('p.last_name', 'like', `%${filter.searchText}%`);
            });
          }
        }
      }

      if (offset) {
        queryBuilder.offset(offset);
      }

      if (limit) {
        queryBuilder.limit(limit);
      }

      // add order by
      if (orderBys) {
        for (let orderBy of orderBys) {
          if (orderBy && orderBy.column) {
            let column = orderBy.column;
            let order = 'asc';
            if (orderBy.order) {
              order = orderBy.order;
            }
            queryBuilder.orderBy(decamelize(column), order);
          }
        }
      }

      if (trx) {
        queryBuilder.transacting(trx);
      }

      let rows = await queryBuilder;
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

  async getById(id, trx) {
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
      log.error('Error in User.getById', e);
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

  async getBriefForUserId(id, trx) {
    const briefFields = ['u.id', 'u.email', 'u.is_active', 'p.display_name', 'p.locale', 'p.language'];

    try {
      let builder = knex
        .select(...briefFields)
        .from('users AS u')
        .where('u.id', '=', id)
        .leftJoin('user_profile AS p', 'p.user_id', 'u.id');

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;
      let ret = _.filter(rows, row => row.id !== null);
      ret = camelizeKeys(ret);
      return ret;
    } catch (e) {
      log.error('Error in User.getBriefForUserIds', e);
      throw e;
    }
  }

  async getBriefForUserIds(ids, trx) {
    const briefFields = ['u.id', 'u.email', 'u.is_active', 'p.display_name', 'p.locale', 'p.language'];

    try {
      let builder = knex
        .select(...briefFields)
        .from('users AS u')
        .whereIn('u.id', ids)
        .leftJoin('user_profile AS p', 'p.user_id', 'u.id');

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;
      let ret = _.filter(rows, row => row.id !== null);
      ret = camelizeKeys(ret);
      return ret;
    } catch (e) {
      log.error('Error in User.getBriefForUserIds', e);
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
        .select('p')
        .leftJoin('user_profile AS p')
        .where('p.id', '=', id)
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
