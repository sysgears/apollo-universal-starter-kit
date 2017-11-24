import { camelizeKeys, decamelize } from 'humps';
import { has } from 'lodash';

import { $Module$ as $Module$Schema } from './schema';
import knex from '../../../server/sql/connector';

export default class $Module$ {
  async get$Module$s({ orderBy, filter }) {
    const queryBuilder = knex.select('*').from('$module$');

    if (orderBy && orderBy.column) {
      let column = orderBy.column;
      let order = 'asc';
      if (orderBy.order) {
        order = orderBy.order;
      }

      queryBuilder.orderBy(decamelize(column), order);
    }

    if (filter) {
      if (has(filter, 'searchText') && filter.searchText !== '') {
        queryBuilder.where(function() {
          for (const key of CrudSchema.keys()) {
            const value = CrudSchema.values[key];
            if (value.searchText) {
              this.orWhere(key, 'like', `%${filter.searchText}%`);
            }
          }
        });
      }
    }

    return camelizeKeys(await queryBuilder);
  }

  async get$Module$({ id }) {
    return camelizeKeys(await knex.select('*').from('$module$').where({ id }).first());
  }

  add$Module$(input) {
    return knex('$module$')
      .insert(input)
      .returning('id');
  }

  edit$Module$({ id, ...input}) {
    return knex('$module$')
      .update(input)
      .where({ id });
  }

  delete$Module$(id) {
    return knex('$module$')
      .where('id', '=', id)
      .del();
  }
}
