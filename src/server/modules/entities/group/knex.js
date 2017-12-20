import { camelizeKeys, decamelizeKeys, decamelize } from 'humps';
import { has, _ } from 'lodash';
import uuidv4 from 'uuid';

import log from '../../../../common/log';
import knex from '../../../sql/connector';
import { orderedFor } from '../../../sql/helpers';

export default class Group {
  async list(args, trx) {
    try {
      let { filters, orderBys, offset, limit } = args;

      const queryBuilder = knex
        .select('g.id', 'g.created_at', 'g.updated_at', 'g.is_active', 'g.name', 'p.display_name', 'p.description')
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
        .select('g.id', 'g.created_at', 'g.updated_at', 'g.is_active', 'g.name', 'p.display_name', 'p.description')
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
        .select('p')
        .leftJoin('group_profile AS p')
        .where('p.id', '=', id)
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

  async getGroupsForUserId(userId, trx) {
    try {
      let builder = knex
        .select('g.id AS id', 'g.name', 'g.is_active', 'p.display_name', 'p.description')
        .where('gu.user_id', '=', userId)
        .from('groups_users AS gu')
        .leftJoin('groups AS g', 'gu.group_id', 'g.id')
        .leftJoin('group_profile AS p', 'p.group_id', 'g.id');

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;
      let ret = _.filter(rows, row => row.id !== null);
      let res = camelizeKeys(ret);
      return res;
    } catch (e) {
      log.error('Error in User.getGroupsForUserId', e);
      throw e;
    }
  }

  async getGroupsForUserIds(userIds, trx) {
    try {
      let builder = knex
        .select('g.id AS id', 'g.name', 'g.is_active', 'p.display_name', 'p.description', 'gu.user_id AS userId')
        .from('groups_users AS gu')
        .whereIn('gu.user_id', userIds)
        .leftJoin('groups AS g', 'gu.group_id', 'g.id')
        .leftJoin('group_profile AS p', 'p.group_id', 'g.id');

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;
      let ret = _.filter(rows, row => row.id !== null);
      let res = camelizeKeys(ret);
      return orderedFor(res, userIds, 'userId', false);
    } catch (e) {
      log.error('Error in User.getGroupsForUserIds', e);
      throw e;
    }
  }

  async getOrgsForGroupIds(groupIds, trx) {
    try {
      let builder = await knex
        .select('o.id AS id', 'o.name AS orgName', 'g.id AS groupId', 'g.name')
        .whereIn('g.id', groupIds)
        .from('groups AS g')
        .leftJoin('orgs_groups AS og', 'og.group_id', 'g.id')
        .leftJoin('orgs AS o', 'o.id', 'og.org_id');

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;
      let ret = _.filter(rows, row => row.id !== null);
      let res = camelizeKeys(ret);
      return orderedFor(res, groupIds, 'groupId', false);
    } catch (e) {
      log.error('Error in Group.getOrgsForGroupIds', e);
      throw e;
    }
  }

  async getUsersForGroupIds(groupIds, trx) {
    try {
      let builder = knex
        .select('gu.user_id AS userId', 'g.id AS groupId', 'g.name')
        .whereIn('g.id', groupIds)
        .from('groups AS g')
        .leftJoin('groups_users AS gu', 'gu.group_id', 'g.id');
      // left join bindings and group_roles to get role name/id per user

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;
      let ret = _.filter(rows, row => row.id !== null);
      let res = camelizeKeys(ret);
      res = orderedFor(res, groupIds, 'groupId', false);
      return res;
    } catch (e) {
      log.error('Error in Group.getUsersForGroupIds', e);
      throw e;
    }
  }

  async getServiceAccountsForGroupIds(groupIds, trx) {
    try {
      let builder = await knex
        .select('gs.id AS id', 'g.id AS groupId', 'g.name')
        .whereIn('g.id', groupIds)
        .from('groups AS g')
        .leftJoin('groups_serviceaccounts AS gs', 'gs.group_id', 'g.id');

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;
      let ret = _.filter(rows, row => row.id !== null);
      let res = camelizeKeys(ret);
      return orderedFor(res, groupIds, 'groupId', false);
    } catch (e) {
      log.error('Error in Group.getServiceAccountsForGroupIds', e);
      throw e;
    }
  }
}
