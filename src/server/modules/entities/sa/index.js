import { camelizeKeys, decamelizeKeys, decamelize } from 'humps';
import { has, _ } from 'lodash';
import uuidv4 from 'uuid';

import knex from '../../../../server/sql/connector';
import { orderedFor } from '../../../../server/sql/helpers';

export default class ServiceAccount {
  async list(args) {
    let { filters, orderBys, offset, limit } = args;

    const queryBuilder = knex
      .select('s.id as id', 's.created_at', 's.updated_at', 's.is_active', 's.email', 'p.display_name', 'p.description')
      .from('serviceaccounts AS s')
      .leftJoin('serviceaccount_profile AS p', 'p.serviceaccount_id', 's.id');

    // add filter conditions
    if (filters) {
      for (let filter of filters) {
        if (has(filter, 'isActive') && filter.isActive !== null) {
          queryBuilder.where(function() {
            this.where('s.is_active', filter.isActive);
          });
        }

        if (has(filter, 'searchText') && filter.searchText !== '') {
          queryBuilder.where(function() {
            this.where('s.email', 'like', `%${filter.searchText}%`)
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
        .select('s.id', 's.created_at', 's.updated_at', 's.is_active', 's.email', 'p.display_name', 'p.description')
        .from('serviceaccounts AS s')
        .where('s.id', '=', id)
        .leftJoin('serviceaccount_profile AS p', 'p.serviceaccount_id', 's.id')
        .first()
    );
  }

  async getOrgsForServiceAccountId(saId) {
    let rows = await knex
      .select('o.id AS id', 'o.name', 'sa.id AS saId')
      .whereIn('sa.id', saId)
      .from('serviceaccounts AS sa')
      .leftJoin('orgs_serviceaccounts AS os', 'os.serviceaccount_id', 'sa.id')
      .leftJoin('orgs AS o', 'o.id', 'os.org_id');

    let res = _.filter(rows, row => row.id !== null);
    return orderedFor(res, saId, 'saId', false);
  }
  async getOrgsForServiceAccountIdViaGroups(saId) {
    let rows = await knex
      .select('o.id AS id', 'o.name', 'sa.id AS saId')
      .whereIn('sa.id', saId)
      .from('serviceaccounts AS sa')
      .leftJoin('groups_serviceaccounts AS gu', 'gu.serviceaccount_id', 'sa.id')
      .leftJoin('orgs_groups AS og', 'og.group_id', 'gu.group_id')
      .leftJoin('orgs AS o', 'o.id', 'og.group_id');

    let res = _.filter(rows, row => row.id !== null);
    return orderedFor(res, saId, 'saId', false);
  }
  async getGroupsForServiceAccountId(saId) {
    let rows = await knex
      .select('g.id AS id', 'g.name', 'sa.id AS saId')
      .whereIn('sa.id', saId)
      .from('serviceaccounts AS sa')
      .leftJoin('groups_serviceaccounts AS gu', 'gu.serviceaccount_id', 'sa.id')
      .leftJoin('groups AS g', 'gu.group_id', 'g.id');

    let res = _.filter(rows, row => row.id !== null);
    return orderedFor(res, saId, 'saId', false);
  }

  async create(values) {
    values.id = uuidv4();
    await knex('serviceaccounts').insert(decamelizeKeys(values));
    return values.id;
  }

  async update(id, values) {
    return knex('serviceaccounts')
      .where('id', '=', id)
      .update(decamelizeKeys(values));
  }

  async delete(id) {
    return knex('serviceaccounts')
      .where('id', '=', id)
      .delete();
  }

  async getProfile(id) {
    return knex
      .select('p')
      .from('serviceaccount_profile AS p')
      .where('p.id', '=', id)
      .first();
  }

  async createProfile(id, values) {
    values.serviceaccountId = id;
    return knex('serviceaccount_profile').insert(decamelizeKeys(values));
  }

  async updateProfile(id, values) {
    return knex('serviceaccount_profile')
      .where('serviceaccount_id', '=', id)
      .update(decamelizeKeys(values));
  }

  async deleteProfile(id) {
    return knex('serviceaccount_profile')
      .where('serviceaccount_id', '=', id)
      .delete();
  }
}
