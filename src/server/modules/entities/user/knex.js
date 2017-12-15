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
  'u.uuid AS id',
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
  'p.language',
  'r.role'
];

export default class User {
  async list(args) {
    let { filters, orderBys, offset, limit } = args;

    console.log('User.list', args);
    const queryBuilder = knex
      .select(...selectFields)
      .from('users AS u')
      .leftJoin('user_profile AS p', 'p.user_id', 'u.id')
      .leftJoin('user_roles AS r', 'p.user_id', 'r.user_id');

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

  async get(uuid) {
    console.log('User.get', ...selectFields);
    let ret = await knex
      .select(...selectFields)
      .from('users AS u')
      .leftJoin('user_profile AS p', 'p.user_id', 'u.id')
      .leftJoin('user_roles AS r', 'r.user_id', 'p.user_id')
      .where('u.uuid', '=', uuid)
      .first();
    console.log('User.get', ret);
    return camelizeKeys(ret);
  }

  async getById(id) {
    return camelizeKeys(
      await knex
        .select(...selectFields)
        .from('users AS u')
        .where('u.uuid', '=', id)
        .leftJoin('user_profile AS p', 'p.user_id', 'u.id')
        .leftJoin('user_roles AS r', 'p.user_id', 'r.user_id')
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
        .leftJoin('user_roles AS r', 'p.user_id', 'r.user_id')
        .first()
    );
  }

  async getOrgsForUserId(userId) {
    let rows = await knex
      .select('o.uuid AS id', 'o.name', 'u.uuid AS userId')
      .whereIn('u.uuid', userId)
      .from('users AS u')
      .leftJoin('orgs_users AS ou', 'ou.user_id', 'u.id')
      .leftJoin('orgs AS o', 'o.id', 'ou.org_id');

    let res = _.filter(rows, row => row.id !== null);
    return orderedFor(res, userId, 'userId', false);
  }

  async getOrgsForUserIdViaGroups(userId) {
    let rows = await knex
      .select('o.uuid AS id', 'o.name', 'u.uuid AS userId')
      .whereIn('u.uuid', userId)
      .from('users AS u')
      .leftJoin('groups_users AS gu', 'gu.user_id', 'u.id')
      .leftJoin('orgs_groups AS og', 'og.group_id', 'gu.group_id')
      .leftJoin('orgs AS o', 'o.id', 'og.group_id');

    let res = _.filter(rows, row => row.id !== null);
    return orderedFor(res, userId, 'userId', false);
  }

  async getGroupsForUserId(userId) {
    let rows = await knex
      .select('g.uuid AS id', 'g.name', 'u.uuid AS userId')
      .whereIn('u.uuid', userId)
      .from('users AS u')
      .leftJoin('groups_users AS gu', 'gu.user_id', 'u.id')
      .leftJoin('groups AS g', 'gu.group_id', 'g.id');

    let res = _.filter(rows, row => row.id !== null);
    return orderedFor(res, userId, 'userId', false);
  }

  async create(values) {
    values.uuid = uuidv4();
    await knex('users').insert(decamelizeKeys(values));
    return values.uuid;
  }

  async getInternalIdFromUUID(uuid) {
    let ret = await knex
      .select('id')
      .from('users')
      .where('uuid', '=', uuid)
      .first();
    if (ret && ret.id) {
      return ret.id;
    }
    return ret;
  }

  async update(uuid, values) {
    return knex('users')
      .where('uuid', '=', uuid)
      .update(decamelizeKeys(values));
  }

  async delete(uuid) {
    return knex('users')
      .where('uuid', '=', uuid)
      .delete();
  }

  async getProfile(uuid) {
    return knex
      .select('p')
      .join('users AS q')
      .where('q.uuid', '=', uuid)
      .leftJoin('user_profile AS p', 'p.user_id', 'q.id')
      .first();
  }

  async createProfile(uuid, values) {
    let userId = await this.getInternalIdFromUUID(uuid);
    console.log('User.createProfile', userId, uuid, values);
    values.userId = userId;
    return knex('user_profile').insert(decamelizeKeys(values));
  }

  async updateProfile(uuid, values) {
    let userId = await this.getInternalIdFromUUID(uuid);
    return knex('user_profile')
      .where('user_id', '=', userId)
      .update(decamelizeKeys(values));
  }

  async deleteProfile(uuid) {
    let userId = await this.getInternalIdFromUUID(uuid);
    return knex('user_profile')
      .where('user_id', '=', userId)
      .delete();
  }
}
