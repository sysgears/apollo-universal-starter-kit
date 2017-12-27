/*eslint-disable no-unused-vars*/
import _ from 'lodash';
import uuidv4 from 'uuid';
import { camelize, decamelize, decamelizeKeys, camelizeKeys } from 'humps';

import knex from '../client';

import paging from './paging';
import ordering from './ordering';
import joinBuilder from './joins';
import filterBuilder from './filters';
import { orderedFor } from './batching';

import log from '../../../../../common/log';

export function createAdapter(table, args) {
  let idGen = uuidv4;
  let idField = 'id';
  if (args) {
    if (args.idGen) {
      idGen = args.idGen;
    }
    if (args.idField) {
      idField = decamelize(args.idField);
    }
  }
  return async function(values, trx) {
    try {
      if (values[idField]) {
        delete values[idField];
      }
      values[idField] = idGen();

      let builder = knex(table).insert(decamelizeKeys(values));

      if (trx) {
        builder.transacting(trx);
      }

      await builder;
      return values.id;
    } catch (e) {
      log.error(`Error in ${table}.create()`, e);
      throw e;
    }
  };
}

export function createWithIdAdapter(table, args) {
  return async function(id, values, trx) {
    try {
      values.id = id;
      let builder = knex(table).insert(decamelizeKeys(values));

      if (trx) {
        builder.transacting(trx);
      }

      await builder;
      return values.id;
    } catch (e) {
      log.error(`Error in ${table}.createWithId()`, e);
      throw e;
    }
  };
}

export function createWithoutIdAdapter(table, args) {
  return async function(id, values, trx) {
    try {
      let builder = knex(table).insert(decamelizeKeys(values));

      if (trx) {
        builder.transacting(trx);
      }

      return builder;
    } catch (e) {
      log.error(`Error in ${table}.createWithId()`, e);
      throw e;
    }
  };
}

export function flexAdapter(table, args) {
  let idField = 'id';
  let selects = ['*'];
  if (args) {
    if (args.idField) {
      idField = decamelize(args.idField);
    }
    if (args.selects) {
      selects = _.map(args.selects, elem => decamelize(elem).replace('_a_s', 'AS'));
    }
  }

  return async function(args, trx) {
    try {
      let builder = knex.select(...selects).from(table);

      // add filter conditions
      builder = joinBuilder(builder, args);

      // add filter conditions
      builder = filterBuilder(builder, args);

      // paging and ordering
      builder = paging(builder, args);
      builder = ordering(builder, args);

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;

      let res = _.filter(rows, r => r[idField] !== null);
      res = camelizeKeys(res);
      return res;
      // return orderedFor(res, ids, 'roleId', false);
    } catch (e) {
      log.error(`Error in ${table}.flex(${idField})`, e);
      throw e;
    }
  };
}

export function listAdapter(table, args) {
  let idField = 'id';
  let selects = ['*'];
  let localFilters = null;
  let localJoins = null;
  if (args) {
    if (args.idField) {
      idField = decamelize(args.idField);
    }
    if (args.selects) {
      selects = _.map(args.selects, elem => decamelize(elem).replace('_a_s', 'AS'));
    }
    if (args.joins) {
      localJoins = args.joins;
    }
    if (args.filters) {
      localFilters = args.filters;
    }
  }

  return async function(args, trx) {
    try {
      let builder = knex.select(...selects).from(table);

      if (args.ids) {
        builder.whereIn(idField, args.ids);
      }

      if (localJoins) {
        args.joins = args.joins ? args.joins.concat(localJoins) : localJoins;
      }
      if (localFilters) {
        args.filters = args.filters ? args.filters.concat(localFilters) : localFilters;
      }

      // add filter conditions
      builder = filterBuilder(builder, args);

      // add filter conditions
      builder = filterBuilder(builder, args);

      // paging and ordering
      builder = paging(builder, args);
      builder = ordering(builder, args);

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;

      let res = _.filter(rows, r => r[idField] !== null);
      res = camelizeKeys(res);
      return res;
      // return orderedFor(res, ids, 'roleId', false);
    } catch (e) {
      log.error(`Error in ${table}.list(${idField})`, e);
      throw e;
    }
  };
}

export function pagingAdapter(table, args) {
  let idField = 'id';
  let selects = ['*'];
  let localFilters = null;
  let localJoins = null;
  if (args) {
    if (args.idField) {
      idField = decamelize(args.idField);
    }
    if (args.selects) {
      selects = _.map(args.selects, elem => decamelize(elem).replace('_a_s', 'AS'));
    }
    if (args.joins) {
      localJoins = args.joins;
    }
    if (args.filters) {
      localFilters = args.filters;
    }
  }

  const makeBuilder = function(args, trx) {
    let builder = knex.select(...selects).from(table);

    if (args.ids) {
      builder.whereIn(idField, args.ids);
    }

    if (localJoins) {
      args.joins = args.joins ? args.joins.concat(localJoins) : localJoins;
    }
    if (localFilters) {
      args.filters = args.filters ? args.filters.concat(localFilters) : localFilters;
    }

    // add filter conditions
    builder = filterBuilder(builder, args);

    // add filter conditions
    builder = filterBuilder(builder, args);

    // paging and ordering
    builder = ordering(builder, args);
    // builder = paging(builder, args);

    if (trx) {
      builder.transacting(trx);
    }

    return builder;
  };

  return async function(args, trx) {
    try {
      // let countRes = await makeBuilder(args,trx).count(idField);
      let countRes = await makeBuilder(args, trx).count(idField);
      let count = countRes[0]['count(`' + idField + '`)'];

      // let rows = await makeBuilder(args, trx)
      let rows = await paging(makeBuilder(args, trx), args);

      let res = _.filter(rows, r => r[idField] !== null);
      res = camelizeKeys(res);
      return {
        count,
        results: res
      };
      // return orderedFor(res, ids, 'roleId', false);
    } catch (e) {
      log.error(`Error in ${table}.list(${idField})`, e);
      throw e;
    }
  };
}

export function getAdapter(table, args) {
  let idField = 'id';
  let selects = ['*'];
  if (args) {
    if (args.idField) {
      idField = decamelize(args.idField);
    }
    if (args.selects) {
      selects = _.map(args.selects, elem => decamelize(elem).replace('_a_s', 'AS'));
    }
  }

  // console.log(`${table}.get - init`, args, idField, selects)
  return async function(id, trx) {
    try {
      // console.log(`${table}.get - id`, id)
      let builder = knex
        .select(...selects)
        .from(table)
        .where(idField, '=', id)
        .first();

      if (trx) {
        builder.transacting(trx);
      }

      let row = await builder;
      // console.log(`${table}.get - row`, row)

      // let res = _.filter(rows, r => r[idField] !== null);
      let res = camelizeKeys(row);
      // console.log(`${table}.get - ret`, res)
      return res;
      // return orderedFor(res, ids, 'roleId', false);
    } catch (e) {
      log.error(`Error in ${table}.get(${idField})`, e);
      throw e;
    }
  };
}

export function findAdapter(table, args) {
  let idField = 'id';
  let selects = ['*'];
  if (args) {
    if (args.idField) {
      idField = decamelize(args.idField);
    }
    if (args.selects) {
      selects = _.map(args.selects, elem => decamelize(elem).replace('_a_s', 'AS'));
    }
  }

  return async function(values, trx) {
    try {
      let builder = knex
        .select(...selects)
        .from(table)
        .where(decamelizeKeys(values))
        .first();

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;

      let res = _.filter(rows, r => r[idField] !== null);
      res = camelizeKeys(res);
      return res;
      // return orderedFor(res, ids, 'roleId', false);
    } catch (e) {
      log.error(`Error in ${table}.find(${values})`, e);
      throw e;
    }
  };
}

export function updateAdapter(table, args) {
  let idField = 'id';
  if (args) {
    if (args.idField) {
      idField = decamelize(args.idField);
    }
  }

  return async function(id, values, trx) {
    try {
      if (values.id) {
        delete values.id;
      }

      let builder = knex(table)
        .update(decamelizeKeys(values))
        .where(idField, '=', id);

      if (trx) {
        builder.transacting(trx);
      }

      return builder;
    } catch (e) {
      log.error(`Error in ${table}.update()`, e);
      throw e;
    }
  };
}

export function updateMultiConditionAdapter(table, args) {
  return async function(conds, values, trx) {
    try {
      if (values.id) {
        delete values.id;
      }

      let builder = knex(table)
        .update(decamelizeKeys(values))
        .where(decamelizeKeys(conds));

      if (trx) {
        builder.transacting(trx);
      }

      return builder;
    } catch (e) {
      log.error(`Error in ${table}.updateMultiCondition()`, e);
      throw e;
    }
  };
}

export function deleteAdapter(table, args) {
  let idField = 'id';
  if (args) {
    if (args.idField) {
      idField = decamelize(args.idField);
    }
  }

  return async function(id, trx) {
    try {
      let builder = knex(table)
        .delete()
        .where(idField, '=', id);

      if (trx) {
        builder.transacting(trx);
      }

      return builder;
    } catch (e) {
      log.error(`Error in ${table}.delete()`, e);
      throw e;
    }
  };
}

export function deleteMultiConditionAdapter(table, args) {
  return async function(conds, trx) {
    try {
      let builder = knex(table)
        .delete()
        .where(decamelizeKeys(conds));

      if (trx) {
        builder.transacting(trx);
      }

      return builder;
    } catch (e) {
      log.error(`Error in ${table}.deleteMultiCondition()`, e);
      throw e;
    }
  };
}

export function getManyRelationAdapter(table, args) {
  let { elemField, collectionField } = args;
  elemField = decamelize(elemField);
  collectionField = decamelize(collectionField);
  let selects = ['*'];
  if (args) {
    if (args.selects) {
      selects = _.map(args.selects, elem => decamelize(elem).replace('_a_s', 'AS'));
    }
  }

  return async function(args, trx) {
    try {
      let builder = knex
        .select(...selects)
        .from(table)
        .whereIn(collectionField, args.ids);

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;

      let ret = _.filter(rows, row => row[elemField] !== null);
      ret = camelizeKeys(ret);
      // console.log(`${table}.getManyRelationAdapter `)
      ret = orderedFor(ret, args.ids, camelize(collectionField), false);
      return ret;
    } catch (e) {
      log.error(`Error in ${table}.getManyRelationAdapter(${elemField},${collectionField})`, e);
      throw e;
    }
  };
}

export function createRelationAdapter(table, args) {
  let { elemField, collectionField } = args;
  elemField = decamelize(elemField);
  collectionField = decamelize(collectionField);
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

export function updateRelationAdapter(table, args) {
  let { elemField, collectionField } = args;
  elemField = decamelize(elemField);
  collectionField = decamelize(collectionField);
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

export function deleteRelationAdapter(table, args) {
  let { elemField, collectionField } = args;
  elemField = decamelize(elemField);
  collectionField = decamelize(collectionField);
  return async function(elemId, collectionId, trx) {
    try {
      let bIds = {};
      bIds[elemField] = elemId;
      bIds[collectionField] = collectionId;

      console.log(`${table}.deleteRelationAdapter - bIds`, bIds);
      let builder = knex(table)
        .where(bIds)
        .delete();

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return ret;
    } catch (e) {
      log.error(`Error in ${table}.deleteRelationAdapter(${elemField},${collectionField})`, e);
      throw e;
    }
  };
}
