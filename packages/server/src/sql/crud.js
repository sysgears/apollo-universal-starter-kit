import _ from 'lodash';
import uuidv4 from 'uuid';
import { decamelize, decamelizeKeys, camelize, camelizeKeys, pascalize } from 'humps';
import knexnest from 'knexnest';
import parseFields from 'graphql-parse-fields';
import moment from 'moment';

import FieldError from '../../../common/FieldError';
import knex from './connector';
import { selectBy, orderedFor } from './helpers';
import selectAdapter from './select';
import log from '../../../common/log';

const dateFormat = 'YYYY-MM-DD';

export function createWithIdGenAdapter(options) {
  const T = options.table;
  let idGen = uuidv4;
  let idField = 'id';
  if (options) {
    if (options.idGen) {
      idGen = options.idGen;
    }
    if (options.idField) {
      idField = options.idField;
    }
  }
  return async function(values, trx) {
    try {
      if (values[idField]) {
        delete values[idField];
      }
      values[idField] = idGen();

      let builder = knex(T).insert(decamelizeKeys(values));

      if (trx) {
        builder.transacting(trx);
      }

      await builder;
      return values.id;
    } catch (e) {
      log.error(`Error in ${T}.create()`, e);
      throw e;
    }
  };
}

export function createWithIdAdapter(options) {
  const T = options.table;
  let idField = 'id';
  if (options) {
    if (options.idField) {
      idField = options.idField;
    }
  }
  return async function(id, values, trx) {
    try {
      values[idField] = id;
      let builder = knex(T).insert(decamelizeKeys(values));

      if (trx) {
        builder.transacting(trx);
      }

      await builder;
      return values[idField];
    } catch (e) {
      log.error(`Error in ${T}.createWithId()`, e);
      throw e;
    }
  };
}

export function createWithoutIdAdapter(options) {
  const T = options.table;
  return async function(values, trx) {
    try {
      let builder = knex(T).insert(decamelizeKeys(values));

      if (trx) {
        builder.transacting(trx);
      }

      return builder;
    } catch (e) {
      log.error(`Error in ${T}.createWithId()`, e);
      throw e;
    }
  };
}

export function getAllAdapter(options) {
  if (!options) options = {};
  if (!options.name) options.name = options.table + ' - getAllAdapter';

  const selector = selectAdapter(options);

  return async function(args, trx) {
    try {
      let ret = await selector(args, trx);
      ret = camelizeKeys(ret);
      return ret;
    } catch (e) {
      log.error(`Error in ${options.name}`, e);
      throw e;
    }
  };
}

export function getAdapter(options) {
  return getByIdAdapter(options);
}

export function getByIdAdapter(options) {
  if (!options) options = {};
  if (!options.name) options.name = options.table + ' - getByIdAdapter';
  if (!options.idField) options.idField = 'id';
  if (!options.filters) options.filters = [];

  options.filters.push({
    field: options.idField,
    compare: '=',
    valueExtractor: args => args.id
  });

  const selector = selectAdapter(options);

  return async function(args, trx) {
    try {
      let ret = await selector(args, trx);
      ret = camelizeKeys(ret[0]);
      return ret;
    } catch (e) {
      log.error(`Error in ${options.name}`, e);
      throw e;
    }
  };
}

export function listAdapter(options) {
  if (!options) options = {};
  if (!options.name) options.name = options.table + ' - listAdapter';
  if (!options.idField) options.idField = 'id';
  if (!options.filters) options.filters = [];

  options.filters.push({
    applyWhen: args => args.ids && args.ids.length > 0,
    field: options.idField,
    compare: 'in',
    valueExtractor: args => args.ids
  });

  const selector = selectAdapter(options);

  return async function(args, trx) {
    try {
      let ret = await selector(args, trx);
      ret = camelizeKeys(ret);
      return ret;
    } catch (e) {
      log.error(`Error in ${options.name}`, e);
      throw e;
    }
  };
}

export function pagingAdapter(options) {
  if (!options) options = {};
  if (!options.name) options.name = options.table + ' - pagingAdapter';
  if (!options.idField) options.idField = 'id';
  if (!options.filters) options.filters = [];
  if (!options.limit) options.limit = 10;

  options.filters.push({
    applyWhen: args => args.ids && args.ids.length > 0,
    field: options.idField,
    compare: 'in',
    valueExtractor: args => args.ids
  });

  options.count = options.idField;
  options.withCount = true;

  const selector = selectAdapter(options);

  return async function(args, trx) {
    try {
      let ret = await selector(args, trx);
      ret.rows = camelizeKeys(ret.rows);

      return {
        results: ret.rows,
        count: ret.count,
        pages: Math.trunc(ret.count / args.limit) + (ret.count % args.limit === 0 ? 0 : 1)
      };
    } catch (e) {
      log.error(`Error in ${options.name}`, e);
      throw e;
    }
  };
}

export function updateAdapter(options) {
  const T = options.table;
  let idField = 'id';
  if (options) {
    if (options.idField) {
      idField = options.idField;
    }
  }

  return async function(id, values, trx) {
    try {
      if (values[idField]) {
        delete values[idField];
      }

      let builder = knex(T)
        .update(decamelizeKeys(values))
        .where(idField, '=', id);

      if (trx) {
        builder.transacting(trx);
      }

      return builder;
    } catch (e) {
      log.error(`Error in ${T}.update()`, e);
      throw e;
    }
  };
}

export function updateMultiConditionAdapter(options) {
  const T = options.table;

  return async function(conds, values, trx) {
    try {
      if (values.id) {
        delete values.id;
      }

      let builder = knex(T)
        .update(decamelizeKeys(values))
        .where(decamelizeKeys(conds));

      if (trx) {
        builder.transacting(trx);
      }

      return builder;
    } catch (e) {
      log.error(`Error in ${T}.updateMultiCondition()`, e);
      throw e;
    }
  };
}

export function deleteAdapter(options) {
  const T = options.table;
  let idField = 'id';
  if (options) {
    if (options.idField) {
      idField = options.idField;
    }
  }

  return async function(id, trx) {
    try {
      let builder = knex(T)
        .delete()
        .where(idField, '=', id);

      if (trx) {
        builder.transacting(trx);
      }

      return builder;
    } catch (e) {
      log.error(`Error in ${T}.delete()`, e);
      throw e;
    }
  };
}

export function deleteMultiConditionAdapter(options) {
  const T = options.table;
  return async function(conds, trx) {
    try {
      let builder = knex(T)
        .delete()
        .where(decamelizeKeys(conds));

      if (trx) {
        builder.transacting(trx);
      }

      return builder;
    } catch (e) {
      log.error(`Error in ${T}.deleteMultiCondition()`, e);
      throw e;
    }
  };
}

export function getManyRelationAdapter(options) {
  if (!options.name) options.name = options.table + ' - listAdapter';
  if (!options.idField) options.idField = 'id';
  if (!options.filters) options.filters = [];

  if (options.ids) {
    options.filters.push({
      applyWhen: args => args.ids,
      field: options.collectionField,
      compare: 'in',
      valueExtractor: args => args.ids
    });
  }

  const selector = selectAdapter(options);

  return async function(args, trx) {
    try {
      let ret = await selector(args, trx);
      ret = _.filter(ret, r => r[options.elemField] !== null);
      if (!args.ids) {
        args.ids = _.uniq(_.map(ret, r => r[options.collectionField]));
      }
      ret = camelizeKeys(ret);
      ret = orderedFor(ret, args.ids, camelize(options.collectionField), false);
      return ret;
    } catch (e) {
      log.error(`Error in ${options.table}.getManyRelationAdapter(${options.elemField},${options.collectionField})`, e);
      throw e;
    }
  };
}

export function createRelationAdapter(options) {
  let { table, elemField, collectionField } = options;
  return async function(elemId, collectionId, trx) {
    try {
      let bIds = {};
      bIds[elemField] = elemId;
      bIds[collectionField] = collectionId;
      let builder = knex(table).insert(bIds);

      if (trx) {
        builder.transacting(trx);
      }

      return await builder;
    } catch (e) {
      log.error(`Error in ${table}.createRelationAdapter(${elemField},${collectionField})`, e);
      throw e;
    }
  };
}

export function updateRelationAdapter(options) {
  let { table, elemField, collectionField } = options;
  return async function(elemId, collectionId, values, trx) {
    try {
      let bIds = {};
      bIds[elemField] = elemId;
      bIds[collectionField] = collectionId;

      let builder = knex(table)
        .update(decamelizeKeys(values))
        .where(bIds);

      if (trx) {
        builder.transacting(trx);
      }

      return builder;
    } catch (e) {
      log.error(`Error in ${table}.updateRelationAdapter(${elemField},${collectionField})`, e);
      throw e;
    }
  };
}

export function deleteRelationAdapter(options) {
  let { table, elemField, collectionField } = options;
  return async function(elemId, collectionId, trx) {
    try {
      let bIds = {};
      bIds[elemField] = elemId;
      bIds[collectionField] = collectionId;

      let builder = knex(table)
        .where(bIds)
        .delete();

      if (trx) {
        builder.transacting(trx);
      }

      return builder;
    } catch (e) {
      log.error(`Error in ${table}.deleteRelationAdapter(${elemField},${collectionField})`, e);
      throw e;
    }
  };
}

export default class Crud {
  getTableName() {
    return decamelize(this.schema.__.tableName ? this.schema.__.tableName : this.schema.name);
  }

  getFullTableName() {
    return `${this.schema.__.tablePrefix}${this.getTableName()}`;
  }

  getSchema() {
    return this.schema;
  }

  normalizeFields(data) {
    //console.log('normalizeFields: ', data);
    for (const key of _.keys(data)) {
      if (this.schema.values.hasOwnProperty(key)) {
        const value = this.schema.values[key];
        const hasTypeOf = targetType => value.type === targetType || value.type.prototype instanceof targetType;
        if (hasTypeOf(Date)) {
          data[key] = moment(data[key]).format('YYYY-MM-DD');
        }
      }
    }
    //console.log('normalizeFields: ', data);
    return data;
  }

  _getList({ limit, offset, orderBy, filter }, info) {
    const baseQuery = knex(`${this.getFullTableName()} as ${this.getTableName()}`);
    const select = selectBy(this.schema, info, false);
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
      //console.log('orderBy, column:', column);
      //console.log('orderBy, order:', order);

      for (const key of this.schema.keys()) {
        if (column === key) {
          const value = this.schema.values[key];
          if (value.type.isSchema) {
            const tableName = decamelize(value.type.__.tableName ? value.type.__.tableName : value.type.name);
            let sortBy = 'name';
            for (const remoteKey of value.type.keys()) {
              const remoteValue = value.type.values[remoteKey];
              if (remoteValue.sortBy) {
                sortBy = remoteKey;
              }
            }
            column = `${tableName}.${sortBy}`;
          } else {
            column = `${this.getTableName()}.${decamelize(column)}`;
          }
        }
      }
      //console.log('column:', column);
      //console.log('order:', order);
      queryBuilder.orderBy(column, order);
    } else {
      queryBuilder.orderBy(`${this.getTableName()}.id`);
    }

    if (filter) {
      //console.log('filter: ', filter);
      const schema = this.schema;
      const tableName = this.getTableName();
      queryBuilder.where(function() {
        for (const key of schema.keys()) {
          const value = schema.values[key];
          const hasTypeOf = targetType => value.type === targetType || value.type.prototype instanceof targetType;
          //console.log('filter, key: ', key);
          let filterKey = key;

          if (value.type.isSchema) {
            filterKey = `${key}Id`;
          }

          //console.log('filter, filterKey: ', filterKey);

          let filterValue = filter[filterKey];
          if (hasTypeOf(Date)) {
            if (filter[`${filterKey}_lte`] && filter[`${filterKey}_lte`] !== '') {
              const filterValue_lte = moment(filter[`${filterKey}_lte`]).format(dateFormat);
              this.andWhere(`${tableName}.${decamelize(filterKey)}`, '>=', `${filterValue_lte}`);
            }
            if (filter[`${filterKey}_gte`] && filter[`${filterKey}_gte`] !== '') {
              const filterValue_gte = moment(filter[`${filterKey}_gte`]).format(dateFormat);
              this.andWhere(`${tableName}.${decamelize(filterKey)}`, '<=', `${filterValue_gte}`);
            }
          } else if (hasTypeOf(Boolean)) {
            if (_.has(filter, filterKey) && filter[filterKey] !== '') {
              if (filterValue === true) {
                filterValue = 1;
              } else {
                filterValue = 0;
              }
              this.andWhere(`${tableName}.${decamelize(filterKey)}`, '=', `${filterValue}`);
            }
          } else {
            if (_.has(filter, filterKey) && filter[filterKey] !== '') {
              this.andWhere(`${tableName}.${decamelize(filterKey)}`, '=', `${filterValue}`);
            }
          }
        }
      });

      if (_.has(filter, 'searchText') && filter.searchText !== '') {
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

    return knexnest(queryBuilder);
  }

  async getPaginated(args, info) {
    const edges = await this._getList(args, parseFields(info).edges);
    const { count } = await this.getTotal();
    //console.log('getPaginated, edges:', edges);
    //console.log('getPaginated, count:', edges);

    return {
      edges,
      pageInfo: {
        totalCount: count,
        hasNextPage: edges && edges.length === args.limit
      }
    };
  }

  getList(args, info) {
    return this._getList(args, parseFields(info));
  }

  getTotal() {
    return knex(`${this.getFullTableName()}`)
      .countDistinct('id as count')
      .first();
  }

  _get({ where }, info) {
    const baseQuery = knex(`${this.getFullTableName()} as ${this.getTableName()}`);
    const select = selectBy(this.schema, info, true);

    const tableName = this.getTableName();
    baseQuery.where(function() {
      Object.keys(where).map(key => {
        this.andWhere(`${tableName}.${decamelize(key)}`, '=', where[key]);
      });
    });

    return knexnest(select(baseQuery));
  }

  _getMany(
    {
      where: { id_in }
    },
    info
  ) {
    const baseQuery = knex(`${this.getFullTableName()} as ${this.getTableName()}`);
    const select = selectBy(this.schema, info);

    baseQuery.whereIn('id', [...id_in]);

    return knexnest(select(baseQuery));
  }

  async get(args, info) {
    const node = await this._get(args, parseFields(info).node);
    return { node };
  }

  _create(data) {
    return knex(`${this.getFullTableName()}`)
      .insert(decamelizeKeys(this.normalizeFields(data)))
      .returning('id');
  }

  async create({ data }, ctx, info) {
    try {
      const e = new FieldError();
      e.throwIf();

      // extract nested entries from data
      let nestedEntries = [];
      for (const key of this.schema.keys()) {
        const value = this.schema.values[key];
        if (value.type.constructor === Array && data[key]) {
          nestedEntries.push({ key, data: data[key] });
          delete data[key];
        } else if (key === 'rank') {
          const total = await this.getTotal();
          data[key] = total.count + 1;
        }
      }

      const [id] = await this._create(data);

      // create nested entries
      if (nestedEntries.length > 0) {
        nestedEntries.map(nested => {
          if (nested.data.create) {
            nested.data.create.map(async create => {
              create[`${camelize(this.schema.name)}Id`] = id;
              await ctx[pascalize(nested.key)]._create(create);
            });
          }
        });
      }

      return await this.get({ where: { id } }, info);
    } catch (e) {
      return { errors: e };
    }
  }

  _update({ data, where }) {
    return knex(`${this.getFullTableName()}`)
      .update(decamelizeKeys(this.normalizeFields(data)))
      .where(where);
  }

  async update(args, ctx, info) {
    try {
      const e = new FieldError();
      e.throwIf();

      // extract nested entries from data
      let nestedEntries = [];
      for (const key of this.schema.keys()) {
        const value = this.schema.values[key];
        if (value.type.constructor === Array && args.data[key]) {
          nestedEntries.push({ key: value.type[0].name, data: args.data[key] });
          delete args.data[key];
        }
      }

      await this._update(args);

      // create, update, delete nested entries
      if (nestedEntries.length > 0) {
        nestedEntries.map(nested => {
          if (nested.data.create) {
            nested.data.create.map(async create => {
              create[`${this.getTableName()}Id`] = args.where.id;
              await ctx[pascalize(nested.key)]._create(create);
            });
          }
          if (nested.data.update) {
            nested.data.update.map(async update => {
              await ctx[pascalize(nested.key)]._update(update);
            });
          }
          if (nested.data.delete) {
            nested.data.delete.map(async where => {
              await ctx[pascalize(nested.key)]._delete({ where });
            });
          }
        });
      }

      return await this.get(args, info);
    } catch (e) {
      return { errors: e };
    }
  }

  _delete({ where }) {
    return knex(`${this.getFullTableName()}`)
      .where(where)
      .del();
  }

  async delete(args, info) {
    try {
      const e = new FieldError();

      const node = await this.get(args, info);

      if (!node) {
        e.setError('delete', 'Node does not exist.');
        e.throwIf();
      }

      const isDeleted = await this._delete(args);

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

  _sort({ data }) {
    return Promise.all([
      this._update({ data: { rank: data[2] }, where: { id: data[0] } }),
      this._update({ data: { rank: data[3] }, where: { id: data[1] } })
    ]);
  }

  async sort(args) {
    try {
      const e = new FieldError();
      e.throwIf();

      const sortCount = await this._sort(args);
      const count = sortCount.reduce((total, num) => total + num);
      if (count > 1) {
        return { count };
      } else {
        e.setError('sort', 'Could not sort Node. Please try again later.');
        e.throwIf();
      }
    } catch (e) {
      return { errors: e };
    }
  }

  _updateMany({ data, where: { id_in } }) {
    return knex(`${this.getFullTableName()}`)
      .update(decamelizeKeys(this.normalizeFields(data)))
      .whereIn('id', id_in);
  }

  async updateMany(args) {
    try {
      const e = new FieldError();
      const updateCount = await this._updateMany(args);

      if (updateCount > 0) {
        return { count: updateCount };
      } else {
        e.setError('update', 'Could not update any of selected Node. Please try again later.');
        e.throwIf();
      }
    } catch (e) {
      return { errors: e };
    }
  }

  _deleteMany({ where: { id_in } }) {
    return knex(`${this.getFullTableName()}`)
      .whereIn('id', id_in)
      .del();
  }

  async deleteMany(args) {
    try {
      const e = new FieldError();

      const deleteCount = await this._deleteMany(args);

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
    info = parseFields(info);
    info[`${by}Id`] = true;
    const baseQuery = knex(`${Obj.getFullTableName()} as ${Obj.getTableName()}`);
    const select = selectBy(Obj.getSchema(), info, false);
    const res = await knexnest(select(baseQuery).whereIn(`${Obj.getTableName()}.${decamelize(by)}_id`, ids));
    return orderedFor(res, ids, `${by}Id`, false);
  }
}
