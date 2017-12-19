import { has } from 'lodash';
import { decamelize } from 'humps';
import knexnest from 'knexnest';

import { selectBy, orderedFor } from './helpers';
import knex from './connector';

export default class Crud {
  getPrefix() {
    return this.prefix;
  }

  getTableName() {
    return this.tableName;
  }

  getSchema() {
    return this.schema;
  }

  getPaginated({ limit, offset, orderBy, filter }, info) {
    const baseQuery = knex(`${this.prefix}${this.tableName} as ${this.tableName}`);
    const select = selectBy(this.schema, info, false, this.prefix);
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
      queryBuilder.orderBy(`${this.tableName}.id`);
    }

    if (filter) {
      if (has(filter, 'searchText') && filter.searchText !== '') {
        const schema = this.schema;
        queryBuilder.where(function() {
          for (const key of schema.keys()) {
            const value = schema.values[key];
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
    return knex(`${this.prefix}${this.tableName}`)
      .countDistinct('id as count')
      .first();
  }

  get({ id }, info) {
    const baseQuery = knex(`${this.prefix}${this.tableName} as ${this.tableName}`);
    const select = selectBy(this.schema, info, true, this.prefix);
    return knexnest(select(baseQuery).where(`${this.tableName}.id`, '=', id));
  }

  add(input) {
    return knex(`${this.prefix}${this.tableName}`)
      .insert(input)
      .returning('id');
  }

  edit({ id, ...input }) {
    return knex(`${this.prefix}${this.tableName}`)
      .update(input)
      .where({ id });
  }

  delete(id) {
    return knex(`${this.prefix}${this.tableName}`)
      .where({ id })
      .del();
  }

  async getByIds(ids, by, Obj, info) {
    info[`${by}Id`] = true;
    const baseQuery = knex(`${Obj.getPrefix()}${Obj.getTableName()} as ${Obj.getTableName()}`);
    const select = selectBy(Obj.getSchema(), info, false, Obj.getPrefix());
    const res = await knexnest(select(baseQuery).whereIn(`${Obj.getTableName()}.${by}_id`, ids));
    return orderedFor(res, ids, `${by}Id`, false);
  }
}
