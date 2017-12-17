import { decamelize } from 'humps';
import { has } from 'lodash';

import parseFields from 'graphql-parse-fields';
import knexnest from 'knexnest';
import { $Module$ as $Module$Schema } from './schema';
import { selectBy } from '../../../server/sql/helpers';
import knex from '../../../server/sql/connector';

const prefix = '';
const tableName = decamelize($Module$Schema.name);

export default class $Module$ {
  get$Module$s({ limit, offset, orderBy, filter }, info) {
    const baseQuery = knex(`${prefix}${tableName} as ${tableName}`);
    const select = selectBy($Module$Schema, parseFields(info).edges, false, prefix);
    const queryBuilder = select(baseQuery);

    if (limit) {
      queryBuilder.limit(limit);
    }

    if (offset) {
      queryBuilder.offset(offset);
    }

    if (orderBy && orderBy.column) {
      let column = orderBy.column;
      let order = 'asc';
      if (orderBy.order) {
        order = orderBy.order;
      }

      queryBuilder.orderBy(decamelize(column), order);
    } else {
      queryBuilder.orderBy(`${tableName}.id`);
    }

    if (filter) {
      if (has(filter, 'searchText') && filter.searchText !== '') {
        queryBuilder.where(function() {
          for (const key of $Module$Schema.keys()) {
            const value = $Module$Schema.values[key];
            if (value.searchText) {
              this.orWhere(key, 'like', `%${filter.searchText}%`);
            }
          }
        });
      }
    }

    return knexnest(queryBuilder);
  }

  getTotal() {
    return knex(`${prefix}${tableName}`)
      .countDistinct('id as count')
      .first();
  }

  get$Module$({ id }, info) {
    const baseQuery = knex(`${prefix}${tableName} as ${tableName}`);
    const select = selectBy($Module$Schema, parseFields(info), true, prefix);
    return knexnest(select(baseQuery).where(`${tableName}.id`, '=', id));
  }

  add$Module$(input) {
    return knex(`${prefix}${tableName}`)
      .insert(input)
      .returning('id');
  }

  edit$Module$({ id, ...input }) {
    return knex(`${prefix}${tableName}`)
      .update(input)
      .where({ id });
  }

  delete$Module$(id) {
    return knex(`${prefix}${tableName}`)
      .where({ id })
      .del();
  }
}
