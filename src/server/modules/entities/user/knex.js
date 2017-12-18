import { camelizeKeys, decamelizeKeys, decamelize } from 'humps';
import { has, _ } from 'lodash';
import uuidv4 from 'uuid';

import knex from '../../../sql/connector';
import { orderedFor } from '../../../sql/helpers';

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
  async list(args) {
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

    return camelizeKeys(await queryBuilder);
  }

  async get(id) {
    let ret = await knex
      .select(...selectFields)
      .from('users AS u')
      .where('u.id', '=', id)
      .leftJoin('user_profile AS p', 'p.user_id', 'u.id')
      .first();
    return camelizeKeys(ret);
  }

  async getById(id) {
    return camelizeKeys(
      await knex
        .select(...selectFields)
        .from('users AS u')
        .where('u.id', '=', id)
        .leftJoin('user_profile AS p', 'p.user_id', 'u.id')
        .first()
    );
  }

  async getByEmail(email) {
    return camelizeKeys(
      await knex
        .select(...selectFields)
        .from('users AS u')
        .where('u.email', '=', email)
        .leftJoin('user_profile AS p', 'p.user_id', 'u.id')
        .first()
    );
  }

  async getBriefForUserIds(ids) {
    return camelizeKeys(
      await knex
        .select(...selectFields)
        .from('users AS u')
        .whereIn('u.id', '=', ids)
        .leftJoin('user_profile AS p', 'p.user_id', 'u.id')
    );
  }

  async getOrgsForUserId(userId) {
    let rows = await knex
      .select('o.id AS id', 'o.name', 'u.id AS userId')
      .where('u.id', '=', userId)
      .from('users AS u')
      .leftJoin('orgs_users AS ou', 'ou.user_id', 'u.id')
      .leftJoin('orgs AS o', 'o.id', 'ou.org_id');

    let res = _.filter(rows, row => row.id !== null);
    return res;
  }

  async getOrgsForUserIds(userIds) {
    let rows = await knex
      .select('o.id AS id', 'o.name', 'u.id AS userId')
      .whereIn('u.id', userIds)
      .from('users AS u')
      .leftJoin('orgs_users AS ou', 'ou.user_id', 'u.id')
      .leftJoin('orgs AS o', 'o.id', 'ou.org_id');

    let res = _.filter(rows, row => row.id !== null);
    return orderedFor(res, userIds, 'userId', false);
  }

  async getOrgsForUserIdsViaGroups(userIds) {
    let rows = await knex
      .select('o.id AS id', 'o.name', 'u.id AS userId')
      .whereIn('u.id', userIds)
      .from('users AS u')
      .leftJoin('groups_users AS gu', 'gu.user_id', 'u.id')
      .leftJoin('orgs_groups AS og', 'og.group_id', 'gu.group_id')
      .leftJoin('orgs AS o', 'o.id', 'og.group_id');

    let res = _.filter(rows, row => row.id !== null);
    return orderedFor(res, userIds, 'userId', false);
  }

  async getGroupsForUserId(userId) {
    let rows = await knex
      .select('g.id AS id', 'g.name', 'g.is_active', 'p.display_name', 'p.description')
      .where('gu.user_id', '=', userId)
      .from('groups_users AS gu')
      .leftJoin('groups AS g', 'gu.group_id', 'g.id')
      .leftJoin('group_profile AS p', 'p.group_id', 'g.id');

    let res = _.filter(rows, row => row.id !== null);
    return camelizeKeys(res);
  }

  async getGroupsForUserIds(userIds) {
    let rows = await knex
      .select('g.id AS id', 'g.name', 'g.is_active', 'p.display_name', 'p.description', 'gu.user_id AS userId')
      .from('groups_users AS gu')
      .whereIn('gu.user_id', userIds)
      .leftJoin('groups AS g', 'gu.group_id', 'g.id')
      .leftJoin('group_profile AS p', 'p.group_id', 'g.id');

    let res = _.filter(rows, row => row.id !== null);
    res = camelizeKeys(res);
    return orderedFor(res, userIds, 'userId', false);
  }

  async create(values) {
    values.id = uuidv4();
    await knex('users').insert(decamelizeKeys(values));
    return values.id;
  }

  async update(id, values) {
    return knex('users')
      .where('id', '=', id)
      .update(decamelizeKeys(values));
  }

  async delete(id) {
    return knex('users')
      .where('id', '=', id)
      .delete();
  }

  async getProfile(id) {
    return knex
      .select('p')
      .leftJoin('user_profile AS p')
      .where('p.id', '=', id)
      .first();
  }

  async createProfile(id, values) {
    values.userId = id;
    return knex('user_profile').insert(decamelizeKeys(values));
  }

  async updateProfile(id, values) {
    return knex('user_profile')
      .where('user_id', '=', id)
      .update(decamelizeKeys(values));
  }

  async deleteProfile(id) {
    return knex('user_profile')
      .where('user_id', '=', id)
      .delete();
  }
}
