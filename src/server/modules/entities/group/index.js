import { camelizeKeys, decamelize } from 'humps';
import { has } from 'lodash';

import knex from '../../../../server/sql/connector';
import { orderedFor } from '../../../../server/sql/helpers';

export default class Group {
  async list(args) {
    let { filters, orderBys, offset, limit } = args;

    const queryBuilder = knex
      .select(
        'g.uuid as id',
        'g.created_at',
        'g.updated_at',
        'g.is_active',
        'g.name',
        'p.display_name',
        'p.description'
      )
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
        .select(
          'g.uuid as id',
          'g.created_at',
          'g.updated_at',
          'g.is_active',
          'g.name',
          'p.display_name',
          'p.description'
        )
        .from('groups AS g')
        .where('g.uuid', '=', id)
        .first()
    );
  }

  async getOrgsForGroupId(groupId) {
    let res = await knex
      .select('o.uuid AS id', 'o.name', 'g.uuid AS groupId')
      .whereIn('g.uuid', groupId)
      .from('groups AS g')
      .leftJoin('orgs_groups AS og', 'og.group_id', 'g.id')
      .leftJoin('orgs AS o', 'o.id', 'og.org_id');

    return orderedFor(res, groupId, 'groupId', false);
  }

  async getUsersForGroupId(groupId) {
    let res = await knex
      .select('u.uuid AS id', 'u.email', 'g.uuid AS groupId')
      .whereIn('g.uuid', groupId)
      .from('groups AS g')
      .leftJoin('groups_users AS gu', 'gu.group_id', 'g.id')
      .leftJoin('users AS u', 'u.id', 'gu.user_id');

    return orderedFor(res, groupId, 'groupId', false);
  }

  async getServiceAccountsForGroupId(groupId) {
    let res = await knex
      .select('sa.uuid AS id', 'sa.email', 'g.uuid AS groupId')
      .whereIn('g.uuid', groupId)
      .from('groups AS g')
      .leftJoin('groups_serviceaccounts AS gu', 'gu.group_id', 'g.id')
      .leftJoin('serviceaccounts AS sa', 'sa.id', 'gu.serviceaccount_id');

    return orderedFor(res, groupId, 'groupId', false);
  }
}
