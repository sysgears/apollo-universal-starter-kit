import { camelizeKeys, decamelize } from 'humps';
import { has } from 'lodash';

import knex from '../../../../server/sql/connector';

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
}
