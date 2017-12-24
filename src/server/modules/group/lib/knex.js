import { camelizeKeys, decamelizeKeys, decamelize } from 'humps';
import { has, _ } from 'lodash';
import uuidv4 from 'uuid';

import log from '../../../../common/log';
import knex from '../../../sql/connector';
import { orderedFor } from '../../../sql/helpers';

const selectFields = [
  'g.id AS group_id',
  'g.is_active',
  'g.created_at',
  'g.updated_at',
  'g.name',

  'p.created_at',
  'p.updated_at',
  'p.display_name',
  'p.description'
];

export default class Group {
  async list(args, trx) {
    try {
      let { filters, orderBys, offset, limit } = args;

      const queryBuilder = knex
        .select(...selectFields)
        .from('groups AS g')
        .leftJoin('group_profile AS p', 'p.group_id', 'g.id');

      // Check if this should be filtered to a User's membership
      if (args.memberId) {
        queryBuilder.leftJoin('groups_users AS m', 'p.group_id', 'm.group_id').where('m.user_id', '=', args.memberId);
      }

      // add filter conditions
      if (filters) {
        for (let filter of filters) {
          if (has(filter, 'isActive') && filter.isActive !== null) {
            queryBuilder.where(function() {
              this.where('g.is_active', filter.isActive);
            });
          }

          if (has(filter, 'searchText') && filter.searchText !== '') {
            queryBuilder.where(function() {
              this.where('g.name', 'like', `%${filter.searchText}%`)
                .orWhere('p.display_name', 'like', `%${filter.searchText}%`)
                .orWhere('p.description', 'like', `%${filter.searchText}%`);
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
      log.error('Error in Group.list', e);
      throw e;
    }
  }

  async get(id, trx) {
    try {
      let builder = knex
        .select(...selectFields)
        .from('groups AS g')
        .where('g.id', '=', id)
        .leftJoin('group_profile AS p', 'p.group_id', 'g.id')
        .first();

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return camelizeKeys(ret);
    } catch (e) {
      log.error('Error in Group.get', e);
      throw e;
    }
  }

  async getMany(ids, trx) {
    try {
      let builder = knex
        .select(...selectFields)
        .from('groups AS g')
        .whereIn('g.id', ids)
        .leftJoin('group_profile AS p', 'p.group_id', 'g.id');

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return camelizeKeys(ret);
    } catch (e) {
      log.error('Error in Group.get', e);
      throw e;
    }
  }

  async getByName(name, trx) {
    try {
      let builder = knex
        .select(...selectFields)
        .from('groups AS g')
        .where('g.name', '=', name)
        .leftJoin('group_profile AS p', 'p.group_id', 'g.id')
        .first();

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return camelizeKeys(ret);
    } catch (e) {
      log.error('Error in Group.get', e);
      throw e;
    }
  }

  async create(values, trx) {
    try {
      values.id = uuidv4();
      let builder = knex('groups').insert(decamelizeKeys(values));

      if (trx) {
        builder.transacting(trx);
      }

      await builder;
      return values.id;
    } catch (e) {
      log.error('Error in Group.create', e);
      throw e;
    }
  }

  async update(id, values, trx) {
    try {
      let builder = knex('groups')
        .where('id', '=', id)
        .update(decamelizeKeys(values));

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return ret;
    } catch (e) {
      log.error('Error in Group.update', e);
      throw e;
    }
  }

  async delete(id, trx) {
    try {
      let builder = knex('groups')
        .where('id', '=', id)
        .delete();

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return ret;
    } catch (e) {
      log.error('Error in Group.delete', e);
      throw e;
    }
  }

  async getProfile(id, trx) {
    try {
      let builder = knex
        .select('*')
        .from('group_profile')
        .where('group_id', '=', id)
        .first();

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return camelizeKeys(ret);
    } catch (e) {
      log.error('Error in Group.getProfile', e);
      throw e;
    }
  }

  async getProfileMany(ids, trx) {
    try {
      let builder = knex
        .select('*')
        .from('group_profile')
        .whereIn('group_id', ids);

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return camelizeKeys(ret);
    } catch (e) {
      log.error('Error in Group.getProfileMany', e);
      throw e;
    }
  }

  async createProfile(id, values, trx) {
    try {
      values.groupId = id;
      let builder = knex('group_profile').insert(decamelizeKeys(values));

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return ret;
    } catch (e) {
      log.error('Error in Group.createProfile', e);
      throw e;
    }
  }

  async updateProfile(id, values, trx) {
    try {
      let builder = knex('group_profile')
        .where('group_id', '=', id)
        .update(decamelizeKeys(values));

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return ret;
    } catch (e) {
      log.error('Error in Group.updateProfile', e);
      throw e;
    }
  }

  async deleteProfile(id, trx) {
    try {
      let builder = knex('group_profile')
        .where('group_id', '=', id)
        .delete();

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return ret;
    } catch (e) {
      log.error('Error in Group.deleteProfile', e);
      throw e;
    }
  }

  /*
   *
   *  Loaders
   *
   */

  async getGroupIdsForUserIds(ids, trx) {
    try {
      let builder = knex
        .select('*')
        .from('groups_users')
        .whereIn('user_id', ids);

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;

      let ret = _.filter(rows, row => row.groupId !== null);
      ret = camelizeKeys(ret);
      ret = orderedFor(ret, ids, 'userId', false);
      return ret;
    } catch (e) {
      log.error('Error in User.getGroupsIdsForUserId', e);
      throw e;
    }
  }

  async getUserIdsForGroupIds(ids, trx) {
    try {
      let builder = knex
        .select('*')
        .from('groups_users')
        .whereIn('group_id', ids);

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;

      let ret = _.filter(rows, row => row.userId !== null);
      ret = camelizeKeys(ret);
      ret = orderedFor(ret, ids, 'groupId', false);
      return ret;
    } catch (e) {
      log.error('Error in Group.getUserIdsForGroupIds', e);
      throw e;
    }
  }
}
