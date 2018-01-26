import { has } from 'lodash';
import { decamelize, decamelizeKeys } from 'humps';
import knexnest from 'knexnest';
import parseFields from 'graphql-parse-fields';

import { selectBy, orderedFor } from './helpers';
import FieldError from '../../../common/FieldError';
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

  async getPaginated({ limit, offset, orderBy, filter }, info) {
    const baseQuery = knex(`${this.prefix}${this.tableName} as ${this.tableName}`);
    const select = selectBy(this.schema, parseFields(info).edges, false, this.prefix);
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
        const tableName = this.tableName;
        queryBuilder.where(function() {
          for (const key of schema.keys()) {
            const value = schema.values[key];
            if (value.searchText) {
              this.orWhere(`${tableName}.${key}`, 'like', `%${filter.searchText}%`);
            }
          }
        });
      }
    }

    const edges = await knexnest(queryBuilder);
    const { count } = await this.getTotal();

    return {
      edges,
      pageInfo: {
        totalCount: count,
        hasNextPage: edges && edges.length === limit
      }
    };
  }

  getTotal() {
    return knex(`${this.prefix}${this.tableName}`)
      .countDistinct('id as count')
      .first();
  }

  async get({ where }, info) {
    const { id } = where;

    const baseQuery = knex(`${this.prefix}${this.tableName} as ${this.tableName}`);
    const select = selectBy(this.schema, parseFields(info).node, true, this.prefix);
    const node = await knexnest(select(baseQuery).where(`${this.tableName}.id`, '=', id));
    return { node };
  }

  async create(data, info) {
    try {
      const e = new FieldError();
      e.throwIf();

      const [id] = await knex(`${this.prefix}${this.tableName}`)
        .insert(decamelizeKeys(data))
        .returning('id');
      return await this.get({ where: { id } }, info);
    } catch (e) {
      return { errors: e };
    }
  }

  async update(data, where, info) {
    try {
      const e = new FieldError();
      e.throwIf();

      await knex(`${this.prefix}${this.tableName}`)
        .update(decamelizeKeys(data))
        .where(where);

      return await this.get({ where }, info);
    } catch (e) {
      return { errors: e };
    }
  }

  async delete(where, info) {
    try {
      const e = new FieldError();

      const node = await this.get({ where }, info);

      if (!node) {
        e.setError('delete', 'Node does not exist.');
        e.throwIf();
      }

      const isDeleted = await knex(`${this.prefix}${this.tableName}`)
        .where(where)
        .del();

      if (isDeleted) {
        return node;
      } else {
        e.setError('delete', 'Could not delete Node. Please try again later.');
        e.throwIf();
      }
    } catch (e) {
      return { errors: e };
    }
  }

  async sort(data) {
    try {
      const e = new FieldError();
      e.throwIf();

      const [sortCount] = await knex.raw(
        `UPDATE ${this.prefix}${this.tableName} t1
        JOIN ${this.prefix}${this.tableName} t2
        ON t1.id = ? AND t2.id = ?
        SET t1.rank = ?,
        t2.rank = ?`,
        data
      );

      if (sortCount.affectedRows > 0) {
        return { count: sortCount.affectedRows };
      } else {
        e.setError('sort', 'Could not sort Node. Please try again later.');
        e.throwIf();
      }
    } catch (e) {
      return { errors: e };
    }
  }

  async updateMany(data, { id_in }) {
    try {
      console.log('updateMany: ', id_in);
      const e = new FieldError();
      e.setError('update', 'Not yet implemented. Please try again later.');
      /*const deleteCount = await knex(`${this.prefix}${this.tableName}`)
        .whereIn('id', id_in)
        .del();

      if (deleteCount > 0) {
        return { count: deleteCount };
      } else {
        e.setError('delete', 'Could not delete any of selected Node. Please try again later.');
        e.throwIf();
      }*/
    } catch (e) {
      return { errors: e };
    }
  }

  async deleteMany({ id_in }) {
    try {
      const e = new FieldError();

      const deleteCount = await knex(`${this.prefix}${this.tableName}`)
        .whereIn('id', id_in)
        .del();

      if (deleteCount > 0) {
        return { count: deleteCount };
      } else {
        e.setError('delete', 'Could not delete any of selected Node. Please try again later.');
        e.throwIf();
      }
    } catch (e) {
      return { errors: e };
    }
  }

  async getByIds(ids, by, Obj, info) {
    info[`${by}Id`] = true;
    const baseQuery = knex(`${Obj.getPrefix()}${Obj.getTableName()} as ${Obj.getTableName()}`);
    const select = selectBy(Obj.getSchema(), info, false, Obj.getPrefix());
    const res = await knexnest(select(baseQuery).whereIn(`${Obj.getTableName()}.${decamelize(by)}_id`, ids));
    return orderedFor(res, ids, `${by}Id`, false);
  }
}
