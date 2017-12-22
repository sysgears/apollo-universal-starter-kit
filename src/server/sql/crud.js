import { has } from 'lodash';
import { decamelize, decamelizeKeys } from 'humps';
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

      for (const key of this.schema.keys()) {
        if (column === key) {
          const value = this.schema.values[key];
          if (value.type.isSchema) {
            let sortBy = 'name';
            for (const remoteKey of value.type.keys()) {
              const remoteValue = value.type.values[remoteKey];
              if (remoteValue.sortBy) {
                sortBy = remoteKey;
              }
            }
            column = `${decamelize(value.type.name)}.${sortBy}`;
          } else {
            column = `${this.tableName}.${decamelize(column)}`;
          }
        }
      }

      queryBuilder.orderBy(column, order);
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
      .insert(decamelizeKeys(input))
      .returning('id');
  }

  edit({ id, ...input }) {
    return knex(`${this.prefix}${this.tableName}`)
      .update(decamelizeKeys(input))
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
