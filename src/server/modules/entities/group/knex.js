import { camelizeKeys, decamelizeKeys, decamelize } from 'humps';
import { has, _ } from 'lodash';
import uuidv4 from 'uuid';

import knex from '../../../../server/sql/connector';
import { orderedFor } from '../../../../server/sql/helpers';

export default class Group {
  async list(args) {
    let { filters, orderBys, offset, limit } = args;

    const queryBuilder = knex
      .select('g.id', 'g.created_at', 'g.updated_at', 'g.is_active', 'g.name', 'p.display_name', 'p.description')
      .from('groups AS g')
      .leftJoin('group_profile AS p', 'p.group_id', 'g.id');

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

    return camelizeKeys(await queryBuilder);
  }

  async get(id) {
    return camelizeKeys(
      await knex
        .select('g.id', 'g.created_at', 'g.updated_at', 'g.is_active', 'g.name', 'p.display_name', 'p.description')
        .from('groups AS g')
        .where('g.id', '=', id)
        .first()
    );
  }

  async getOrgsForGroupId(groupId) {
    let rows = await knex
      .select('o.id AS id', 'o.name', 'g.id AS groupId')
      .whereIn('g.id', groupId)
      .from('groups AS g')
      .leftJoin('orgs_groups AS og', 'og.group_id', 'g.id')
      .leftJoin('orgs AS o', 'o.id', 'og.org_id');

    let res = _.filter(rows, row => row.id !== null);
    return orderedFor(res, groupId, 'groupId', false);
  }

  async getUsersForGroupId(groupId) {
    let rows = await knex
      .select('u.id AS id', 'u.email', 'g.id AS groupId')
      .whereIn('g.id', groupId)
      .from('groups AS g')
      .leftJoin('groups_users AS gu', 'gu.group_id', 'g.id')
      .leftJoin('users AS u', 'u.id', 'gu.user_id');

    let res = _.filter(rows, row => row.id !== null);
    return orderedFor(res, groupId, 'groupId', false);
  }

  async getServiceAccountsForGroupId(groupId) {
    let rows = await knex
      .select('sa.id AS id', 'sa.email', 'g.id AS groupId')
      .whereIn('g.id', groupId)
      .from('groups AS g')
      .leftJoin('groups_serviceaccounts AS gs', 'gs.group_id', 'g.id')
      .leftJoin('serviceaccounts AS sa', 'sa.id', 'gs.serviceaccount_id');

    let res = _.filter(rows, row => row.id !== null);
    return orderedFor(res, groupId, 'groupId', false);
  }

  async create(values) {
    values.id = uuidv4();
    await knex('groups').insert(decamelizeKeys(values));
    return values.id;
  }

  async update(id, values) {
    return knex('groups')
      .where('id', '=', id)
      .update(decamelizeKeys(values));
  }

  async delete(id) {
    return knex('groups')
      .where('id', '=', id)
      .delete();
  }

  async getProfile(id) {
    return knex
      .select('p')
      .leftJoin('group_profile AS p')
      .where('p.id', '=', id)
      .first();
  }

  async createProfile(id, values) {
    values.groupId = id;
    return knex('group_profile').insert(decamelizeKeys(values));
  }

  async updateProfile(id, values) {
    return knex('group_profile')
      .where('group_id', '=', id)
      .update(decamelizeKeys(values));
  }

  async deleteProfile(id) {
    return knex('group_profile')
      .where('group_id', '=', id)
      .delete();
  }
}
