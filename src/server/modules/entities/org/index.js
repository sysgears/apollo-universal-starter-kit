import { camelizeKeys, decamelize } from 'humps';
import { has } from 'lodash';

import knex from '../../../../server/sql/connector';

export default class Org {
  async list(args) {
    let { filters, orderBys, offset, limit } = args;

    const queryBuilder = knex
      .select(
        'o.uuid as id',
        'o.is_active',
        'o.created_at',
        'o.updated_at',
        'o.name',
        'o.domain',
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
              .orWhere('o.domain', 'like', `%${filter.searchText}%`)
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
          'o.uuid as id',
          'o.is_active',
          'o.created_at',
          'o.updated_at',
          'o.name',
          'o.domain',
          'p.display_name',
          'p.description'
        )
        .from('orgs AS o')
        .where('o.uuid', '=', id)
        .leftJoin('org_profile AS p', 'p.org_id', 'o.id')
        .first()
    );
  }
}
