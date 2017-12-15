import { camelizeKeys, decamelizeKeys, decamelize } from 'humps';
import { has, _ } from 'lodash';
import uuidv4 from 'uuid';

import knex from '../../../../server/sql/connector';
import { orderedFor } from '../../../../server/sql/helpers';

export default class Org {
  async list(args) {
    let { filters, orderBys, offset, limit } = args;

    const queryBuilder = knex
      .select(
        'o.id',
        'o.is_active',
        'o.created_at',
        'o.updated_at',
        'o.name',
        'p.domain',
        'p.display_name',
        'p.description'
      )
      .from('orgs AS o')
      .leftJoin('org_profile AS p', 'p.org_id', 'o.id');

    // add filter conditions
    if (filters) {
      for (let filter of filters) {
        if (has(filter, 'isActive') && filter.isActive !== null) {
          queryBuilder.where(function() {
            this.where('o.is_active', filter.isActive);
          });
        }

        if (has(filter, 'searchText') && filter.searchText !== '') {
          queryBuilder.where(function() {
            this.where('o.name', 'like', `%${filter.searchText}%`)
              .orWhere('p.domain', 'like', `%${filter.searchText}%`)
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
        .select(
          'o.id',
          'o.is_active',
          'o.created_at',
          'o.updated_at',
          'o.name',
          'p.domain',
          'p.display_name',
          'p.description'
        )
        .from('orgs AS o')
        .where('o.id', '=', id)
        .leftJoin('org_profile AS p', 'p.org_id', 'o.id')
        .first()
    );
  }

  async getGroupsForOrgId(orgId) {
    let res = await knex
      .select('g.id AS id', 'g.name', 'o.id AS orgId')
      .whereIn('o.id', orgId)
      .from('orgs AS o')
      .leftJoin('orgs_groups AS og', 'og.org_id', 'o.id')
      .leftJoin('groups AS g', 'og.group_id', 'g.id');

    return orderedFor(res, orgId, 'orgId', false);
  }

  async getUsersForOrgId(orgId) {
    let rows = await knex
      .select('u.id AS id', 'u.email', 'o.id AS orgId')
      .whereIn('o.id', orgId)
      .from('orgs AS o')
      .leftJoin('orgs_users AS ou', 'ou.org_id', 'o.id')
      .leftJoin('users AS u', 'u.id', 'ou.user_id');

    let res = _.filter(rows, row => row.id !== null);
    return orderedFor(res, orgId, 'orgId', false);
  }

  async getServiceAccountsForOrgId(orgId) {
    let rows = await knex
      .select('sa.id AS id', 'sa.email', 'o.id AS orgId')
      .whereIn('o.id', orgId)
      .from('orgs AS o')
      .leftJoin('orgs_serviceaccounts AS os', 'os.org_id', 'o.id')
      .leftJoin('serviceaccounts AS sa', 'sa.id', 'os.serviceaccount_id');

    let res = _.filter(rows, row => row.id !== null);
    return orderedFor(res, orgId, 'orgId', false);
  }

  async getUsersForOrgIdViaGroups(orgId) {
    let rows = await knex
      .select('u.id AS id', 'u.email', 'o.id AS orgId')
      .whereIn('o.id', orgId)
      .from('orgs AS o')
      .leftJoin('orgs_groups AS og', 'og.group_id', 'o.id')
      .leftJoin('groups_users AS gu', 'gu.group_id', 'og.group_id')
      .leftJoin('users AS u', 'u.id', 'gu.user_id');

    let res = _.filter(rows, row => row.id !== null);
    return orderedFor(res, orgId, 'orgId', false);
  }

  async getServiceAccountsForOrgIdViaGroups(orgId) {
    let rows = await knex
      .select('sa.id AS id', 'sa.email', 'o.id AS orgId')
      .whereIn('o.id', orgId)
      .from('orgs AS o')
      .leftJoin('orgs_groups AS og', 'og.group_id', 'o.id')
      .leftJoin('groups_serviceaccounts AS gu', 'gu.group_id', 'og.group_id')
      .leftJoin('serviceaccounts AS sa', 'sa.id', 'gu.serviceaccount_id');

    let res = _.filter(rows, row => row.id !== null);
    return orderedFor(res, orgId, 'orgId', false);
  }

  async create(values) {
    values.id = uuidv4();
    await knex('orgs').insert(decamelizeKeys(values));
    return values.id;
  }

  async update(id, values) {
    return knex('orgs')
      .where('id', '=', id)
      .update(decamelizeKeys(values));
  }

  async delete(id) {
    return knex('orgs')
      .where('id', '=', id)
      .delete();
  }

  async getProfile(id) {
    return knex
      .select('p')
      .leftJoin('org_profile AS p')
      .where('p.id', '=', id)
      .first();
  }

  async createProfile(id, values) {
    values.orgId = id;
    return knex('org_profile').insert(decamelizeKeys(values));
  }

  async updateProfile(id, values) {
    return knex('org_profile')
      .where('org_id', '=', id)
      .update(decamelizeKeys(values));
  }

  async deleteProfile(id) {
    return knex('org_profile')
      .where('org_id', '=', id)
      .delete();
  }
}
