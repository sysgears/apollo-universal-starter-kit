import _ from 'lodash';
import uuidv4 from 'uuid';
import { decamelize, decamelizeKeys, camelize, camelizeKeys, pascalize } from 'humps';
import { log } from '@gqlapp/core-common';
import knexnest from 'knexnest';
import parseFields from 'graphql-parse-fields';
import moment from 'moment';
import { FieldError } from '@gqlapp/validation-common-react';

import knex from './connector';
import { selectBy, orderedFor } from './helpers';
import selectAdapter from './select';

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

export class Crud {
  getTableName() {
    return decamelize(this.schema.__.tableName ? this.schema.__.tableName : this.schema.name);
  }

  getFullTableName() {
    return `${this.schema.__.tablePrefix}${this.getTableName()}`;
  }

  isSortable() {
    if (this.schema.__.sortable) {
      return true;
    }
    return false;
  }

  sortableField() {
    if (this.schema.__.sortable) {
      return this.schema.__.sortable;
    }
    return null;
  }

  getSchema() {
    return this.schema;
  }

  getBaseQuery() {
    return knex(`${this.getFullTableName()} as ${this.getTableName()}`);
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
    const select = selectBy(this.schema, info, false);
    const queryBuilder = select(this.getBaseQuery());

    if (limit) {
      queryBuilder.limit(limit);
    }

    if (offset) {
      queryBuilder.offset(offset);
    }

    if (orderBy && orderBy.column) {
      let column = orderBy.column;
      const order = orderBy.order ? orderBy.order : 'asc';

      for (const key of this.schema.keys()) {
        if (column !== key) {
          continue;
        }
        const value = this.schema.values[key];
        if (value.type.isSchema) {
          const tableName = decamelize(value.type.__.tableName ? value.type.__.tableName : value.type.name);
          const foundValue = value.type.keys().find(key => {
            return value.type.values[key].sortBy;
          });
          column = `${tableName}.${foundValue ? foundValue : 'name'}`;
        } else {
          column = `${this.getTableName()}.${decamelize(column)}`;
        }
      }
      queryBuilder.orderBy(column, order);
    } else {
      queryBuilder.orderBy(`${this.getTableName()}.id`);
    }

    this._filter(filter, this.schema, queryBuilder, this.getTableName());

    return knexnest(queryBuilder);
  }

  _filter(filter, schema, queryBuilder, tableName) {
    if (!_.isEmpty(filter)) {
      const addFilterWhere = this.schemaIterator(
        (filterKey, value, isSchema, isArray, _this, tableName, schema, filter) => {
          const hasTypeOf = targetType => value.type === targetType || value.type.prototype instanceof targetType;
          if (hasTypeOf(Date)) {
            if (filter[`${filterKey}_lte`]) {
              const filterValue_lte = moment(filter[`${filterKey}_lte`]).format(dateFormat);
              _this.andWhere(`${tableName}.${decamelize(filterKey)}`, '<=', `${filterValue_lte}`);
            }
            if (filter[`${filterKey}_gte`]) {
              const filterValue_gte = moment(filter[`${filterKey}_gte`]).format(dateFormat);
              _this.andWhere(`${tableName}.${decamelize(filterKey)}`, '>=', `${filterValue_gte}`);
            }
          } else if (hasTypeOf(Boolean)) {
            if (_.has(filter, filterKey)) {
              _this.andWhere(`${tableName}.${decamelize(filterKey)}`, '=', `${+filter[filterKey]}`);
            }
          } else if (isArray) {
            // do nothing
          } else {
            const tableColumn = isSchema ? `${decamelize(filterKey)}_id` : decamelize(filterKey);

            const filterValue = isSchema ? filter[`${filterKey}Id`] : filter[filterKey];
            if (filterValue) {
              _this.andWhere(`${tableName}.${tableColumn}`, '=', `${filterValue}`);
            }

            const filterValueIn = isSchema ? filter[`${filterKey}Id_in`] : filter[`${filterKey}_in`];
            if (filterValueIn) {
              _this.whereIn(`${tableName}.${tableColumn}`, filterValueIn);
            }

            const filterValueContains = isSchema ? filter[`${filterKey}Id_contains`] : filter[`${filterKey}_contains`];
            if (filterValueContains) {
              _this.andWhere(`${tableName}.${tableColumn}`, 'like', `%${filterValueContains}%`);
            }

            const filterValueGt = isSchema ? filter[`${filterKey}Id_gt`] : filter[`${filterKey}_gt`];
            if (_.isString(filterValueGt) || _.isNumber(filterValueGt)) {
              _this.andWhere(`${tableName}.${tableColumn}`, '>', filterValueGt);
            }
          }
        }
      );

      for (const key of schema.keys()) {
        const value = schema.values[key];
        const isArray = value.type.constructor === Array;
        if (isArray && !_.isEmpty(filter[key])) {
          const type = value.type[0];
          const fieldName = decamelize(key);
          const prefix = type.__.tablePrefix ? type.__.tablePrefix : '';
          const foreignTableName = decamelize(type.__.tableName ? type.__.tableName : type.name);
          const baseTableName = decamelize(schema.name);
          const suffix = value.noIdSuffix ? '' : '_id';

          queryBuilder.leftJoin(
            `${prefix}${foreignTableName} as ${fieldName}`,
            `${baseTableName}.id`,
            `${fieldName}.${baseTableName}${suffix}`
          );

          this._filter(filter[key], value.type[0], queryBuilder, fieldName);
        }
      }

      queryBuilder.where(function() {
        addFilterWhere(this, tableName, schema, filter);
      });
      if (filter.searchText) {
        const addSearchTextWhere = this.schemaIterator(
          (key, value, isSchema, isArray, _this, tableName, schema, filter) => {
            if (value.searchText) {
              _this.orWhere(`${tableName}.${decamelize(key)}`, 'like', `%${filter.searchText}%`);
            }
          }
        );
        queryBuilder.where(function() {
          addSearchTextWhere(this, tableName, schema, filter);
        });
      }
    }
  }

  schemaIterator = fn => {
    return (_this, tableName, schema, filter) => {
      for (const key of schema.keys()) {
        const value = schema.values[key];
        const isSchema = value.type.isSchema;
        const isArray = value.type.constructor === Array;
        fn(key, value, isSchema, isArray, _this, tableName, schema, filter);
      }
    };
  };

  async getPaginated(args, info) {
    const edges = await this._getList(args, parseFields(info).edges);
    const { count } = await this.getTotal(args);

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

  getTotal(args = {}) {
    const queryBuilder = knex(`${this.getFullTableName()} as ${this.getTableName()}`)
      .countDistinct(`${this.getTableName()}.id as count`)
      .first();

    if (args.filter) {
      this._filter(args.filter, this.schema, queryBuilder, this.getTableName());
    }
    return queryBuilder;
  }

  _get({ where }, info) {
    const baseQuery = knex(`${this.getFullTableName()} as ${this.getTableName()}`);
    const select = selectBy(this.schema, info, true);

    const tableName = this.getTableName();
    baseQuery.where(function() {
      Object.keys(where).map(key => {
        if (key.endsWith('_in')) {
          const keyIn = key.substring(0, key.length - 3);
          this.whereIn(`${tableName}.${decamelize(keyIn)}`, where[key]);
        } else {
          this.andWhere(`${tableName}.${decamelize(key)}`, '=', where[key]);
        }
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
    return knex(this.getFullTableName())
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
        }
      }

      if (this.isSortable()) {
        const total = await this.getTotal();
        data[this.sortableField()] = total.count + 1;
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
      await ctx.Log.create({
        type: 'error',
        module: this.getTableName(),
        action: 'create',
        message: JSON.stringify(e),
        userId: ctx.user.id
      });
      return { errors: e };
    }
  }

  _update({ data, where }, ctx) {
    // extract nested entries from data
    let nestedEntries = [];
    for (const key of this.schema.keys()) {
      const value = this.schema.values[key];
      if (value.type.constructor === Array && data[key]) {
        nestedEntries.push({ key: value.type[0].name, data: data[key] });
        delete data[key];
      }
    }

    // create, update, delete nested entries
    if (nestedEntries.length > 0) {
      nestedEntries.map(nested => {
        if (nested.data.create) {
          nested.data.create.map(async create => {
            create[`${this.getTableName()}Id`] = where.id;
            await ctx[pascalize(nested.key)]._create(create);
          });
        }
        if (nested.data.update) {
          nested.data.update.map(async update => {
            await ctx[pascalize(nested.key)]._update(update, ctx);
          });
        }
        if (nested.data.delete) {
          nested.data.delete.map(async where => {
            await ctx[pascalize(nested.key)]._delete({ where });
          });
        }
      });
    }

    return knex(this.getFullTableName())
      .update(decamelizeKeys(this.normalizeFields(data)))
      .where(where);
  }

  async update(args, ctx, info) {
    try {
      const e = new FieldError();
      e.throwIf();

      await this._update(args, ctx);

      return await this.get(args, info);
    } catch (e) {
      await ctx.Log.create({
        type: 'error',
        module: this.getTableName(),
        action: 'update',
        message: JSON.stringify(e),
        userId: ctx.user.id
      });
      return { errors: e };
    }
  }

  _delete({ where }) {
    return knex(this.getFullTableName())
      .where(decamelizeKeys(where))
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
      if (this.isSortable()) {
        const object = await knex(this.getFullTableName())
          .select(`${this.sortableField()} as rank`)
          .where(args.where)
          .first();

        await knex(this.getFullTableName())
          .decrement(this.sortableField(), 1)
          .where(this.sortableField(), '>', object.rank);
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

  async _sort({ data }) {
    // console.log('_sort, data:', data);
    const oldId = data[0];
    // const newId = data[1];

    const oldPosition = data[3];
    const newPosition = data[2];

    if (oldPosition === newPosition) {
      return 0;
    }

    const fullTableName = this.getFullTableName();
    const sortableField = this.sortableField();
    const total = await this.getTotal();
    return knex.transaction(async function(trx) {
      try {
        // Move the object away
        await knex(fullTableName)
          .update({ [sortableField]: total.count + 1 })
          .where({ id: oldId })
          .transacting(trx);
        // Shift the objects between the old and the new position
        const baseQuery = knex(fullTableName);
        if (oldPosition < newPosition) {
          baseQuery.decrement(sortableField, 1);
        } else {
          baseQuery.increment(sortableField, 1);
        }
        let count = await baseQuery
          .whereBetween(sortableField, [Math.min(oldPosition, newPosition), Math.max(oldPosition, newPosition)])
          .transacting(trx);
        // Move the object back in
        count += await knex(fullTableName)
          .update({ [sortableField]: newPosition })
          .where({ id: oldId })
          .transacting(trx);
        await trx.commit;
        return count;
      } catch (e) {
        trx.rollback;
        return 0;
      }
    });
  }

  async sort(args) {
    try {
      const e = new FieldError();
      e.throwIf();

      const count = await this._sort(args);
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

  async _updateMany({ data, where: { id_in } }) {
    // console.log('_updateMany:', data);
    let normalizedData = {};
    for (const key of Object.keys(data)) {
      const schemaKey = key.endsWith('Id') ? key.substring(0, key.length - 2) : key;
      const value = this.schema.values[schemaKey];
      // add fields from one to one relation
      if (value.type.constructor === Array && value.hasOne) {
        let normalizedNestedData = {};
        const type = value.type[0];
        const fieldName = decamelize(key);
        const prefix = type.__.tablePrefix ? type.__.tablePrefix : '';
        const suffix = value.noIdSuffix ? '' : '_id';
        const foreignTableName = decamelize(type.__.tableName ? type.__.tableName : type.name);

        // get ids of one to one entity
        const ids = await knex
          .select('id')
          .from(`${prefix}${foreignTableName}`)
          .whereIn(`${this.getTableName()}${suffix}`, id_in)
          .reduce((array, value) => {
            array.push(value.id);
            return array;
          }, []);
        // console.log('ids:', ids);

        for (const nestedKey of Object.keys(data[key].update[0].data)) {
          const nestedSchemaKey = nestedKey.endsWith('Id') ? nestedKey.substring(0, nestedKey.length - 2) : nestedKey;
          if (type.values[nestedSchemaKey].type.constructor !== Array) {
            normalizedNestedData[nestedKey] = data[key].update[0].data[nestedKey];
          } else {
            // add new entries for many to many properties
            if (Object.keys(data[key].update[0].data[nestedKey].update[0].data).length > 0) {
              const nestedType = type.values[nestedSchemaKey].type[0];

              // console.log('nestedKey:', nestedKey);
              // console.log('type:', nestedType.name);
              // console.log('tableName:', nestedType.__.tableName);

              const nestedTableName = `${nestedType.__.tablePrefix}${decamelize(
                nestedType.__.tableName ? nestedType.__.tableName : nestedType.name
              )}`;

              // get related field
              let nestedChildId = null;
              let nestedChildValue = null;
              for (const nestedChildKey of Object.keys(data[key].update[0].data[nestedKey].update[0].data)) {
                if (nestedChildKey.endsWith('Id')) {
                  nestedChildId = decamelize(nestedChildKey);
                  nestedChildValue = data[key].update[0].data[nestedKey].update[0].data[nestedChildKey];
                }
              }

              if (nestedChildId) {
                // console.log('nestedTableName:', nestedTableName);
                // console.log('nestedChildId:', nestedChildId);
                // console.log('nestedChildValue:', nestedChildValue);
                // console.log('field name:', `${fieldName}${suffix}`);
                // console.log('ids:', ids);
                // delete all existing records for this property
                await knex(nestedTableName)
                  .whereIn(`${fieldName}${suffix}`, ids)
                  .andWhere(nestedChildId, '=', nestedChildValue)
                  .del();

                // insert new entries for all selected records
                for (const id of ids) {
                  let insertFields = decamelizeKeys(data[key].update[0].data[nestedKey].update[0].data);
                  insertFields[`${fieldName}${suffix}`] = id;
                  // console.log('insertFields:', insertFields);
                  await knex(nestedTableName).insert(insertFields);
                }
              }
            }
          }
        }

        if (Object.keys(normalizedNestedData).length > 0) {
          normalizedNestedData = decamelizeKeys(this.normalizeFields(normalizedNestedData));
          // console.log('normalizedNestedData:', normalizedNestedData);
          return knex(`${prefix}${foreignTableName}`)
            .update(normalizedNestedData)
            .whereIn('id', ids);
        }
      } else {
        normalizedData[`${this.getTableName()}.${key}`] = data[key];
      }
    }

    if (Object.keys(normalizedData).length > 0) {
      normalizedData = decamelizeKeys(this.normalizeFields(normalizedData));
      return this.getBaseQuery()
        .update(normalizedData)
        .whereIn(`${this.getTableName()}.id`, id_in);
    } else {
      return 1;
    }
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
      console.error(`Error in ${this.getFullTableName()}.updateMany()`, e);
      return { errors: e };
    }
  }

  _deleteMany({ where: { id_in } }) {
    return knex(this.getFullTableName())
      .whereIn('id', id_in)
      .del();
  }

  async deleteMany(args) {
    try {
      const e = new FieldError();

      if (this.isSortable()) {
        // for every deleted object decrease rank acordingly
        for (const id of args.where.id_in) {
          const object = await knex(this.getFullTableName())
            .select(`${this.sortableField()} as rank`)
            .where({ id })
            .first();

          await knex(this.getFullTableName())
            .decrement(this.sortableField(), 1)
            .where(this.sortableField(), '>', object.rank);
        }
      }

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

  async getByIds(ids, by, Obj, info, infoCustom = null) {
    info = infoCustom === null ? parseFields(info) : infoCustom;
    const remoteId = by !== 'id' ? `${by}Id` : by;
    info[remoteId] = true;
    const baseQuery = knex(`${Obj.getFullTableName()} as ${Obj.getTableName()}`);
    const select = selectBy(Obj.getSchema(), info, false);
    const res = await knexnest(select(baseQuery).whereIn(`${Obj.getTableName()}.${decamelize(remoteId)}`, ids));
    return orderedFor(res, ids, remoteId, false);
  }
}
