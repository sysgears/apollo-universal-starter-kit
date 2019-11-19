import _ from 'lodash';
import uuidv4 from 'uuid';
import { decamelize, decamelizeKeys, camelize, camelizeKeys } from 'humps';
import { log } from '@gqlapp/core-common';
import knexnest from 'knexnest';
import parseFields from 'graphql-parse-fields';

import knex from './connector';
import { selectBy, orderedFor } from './helpers';
import selectAdapter from './select';

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

  getSchema() {
    return this.schema;
  }

  getBaseQuery() {
    return knex(`${this.getFullTableName()} as ${this.getTableName()}`);
  }

  _findMany(_, info) {
    const select = selectBy(this.schema, info, false);
    const queryBuilder = select(this.getBaseQuery());

    return knexnest(queryBuilder);
  }

  findMany(args, info) {
    return this._findMany(args, parseFields(info));
  }
}
