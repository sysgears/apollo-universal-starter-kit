import { log } from '@gqlapp/core-common';

import knex from './connector';

import paging from './paging';
import ordering from './ordering';
import grouping from './grouping';
import joinBuilder from './joins';
import filterBuilder from './filters';

/*eslint-disable no-unused-vars*/

export default function selectAdapter(options) {
  // defaults and local options obj
  const opts = {
    name: options.name || options.table + ' - selectAdapter',
    table: options.table,
    selects: options.selects || ['*'],
    idField: options.idField || 'id',
    filters: options.filters,
    joins: options.joins,
    orderBys: options.orderBys,
    groupBys: options.groupBys,
    offset: options.offset ? options.offset : 0,
    limit: options.limit ? options.limit : 0,
    printSQL: options.printSQL,
    count: options.count,
    countDistinct: options.countDistinct,
    onlyCount: options.onlyCount,
    withCount: options.withCount
  };

  return async function(args, trx) {
    try {
      // merge filters and joinClauses
      args.filters = [
        {
          prefilters: args.filters,
          postfiltersBool: args.mergeBool || 'and',
          postfilters: opts.filters
        }
      ];
      args.joins = opts.joins ? opts.joins.concat(args.joins) : args.joins;
      args.orderBys = opts.orderBys ? opts.orderBys.concat(args.orderBys) : args.orderBys;
      args.groupBys = opts.groupBys ? opts.groupBys.concat(args.groupBys) : args.groupBys;

      // supply default paging options
      args.offset = args.offset ? args.offset : opts.offset;
      args.limit = args.limit ? args.limit : opts.limit;

      // merge extra
      args.printSQL = args.printSQL ? args.printSQL : opts.printSQL;
      args.count = args.count ? args.count : opts.count;
      args.countDistinct = args.countDistinct ? args.countDistinct : opts.countDistinct;
      args.onlyCount = args.onlyCount ? args.onlyCount : opts.onlyCount;
      args.withCount = args.withCount ? args.withCount : opts.withCount;

      // local function
      const makeBuilder = function(args, trx) {
        let localBuilder = knex.select(...(args.selectOverride || opts.selects)).from(opts.table);

        // add join conditions
        localBuilder = joinBuilder(localBuilder, args);

        // add filter conditions
        localBuilder = filterBuilder(localBuilder, args);

        // grouping, ordering
        localBuilder = grouping(localBuilder, args);
        localBuilder = ordering(localBuilder, args);

        if (trx) {
          localBuilder.transacting(trx);
        }

        return localBuilder;
      }; // End of makcBuilder(...) def

      let count = null;
      if (args.count) {
        // are we printing SQL?
        if (args.printSQL) {
          const sql = await makeBuilder(args, trx).toString();
          console.log(`${opts.name} - SQL`, sql);
        }

        let outerBuilderA = makeBuilder(args, trx).count(args.count);

        const countRes = await outerBuilderA;
        const cnt = countRes[0]['count(`' + opts.idField + '`)'];
        if (args.onlyCount) {
          return cnt;
        }
        count = cnt;
      }
      if (args.countDistinct) {
        // are we printing SQL?
        if (args.printSQL) {
          const sql = await makeBuilder(args, trx).toString();
          console.log(`${opts.name} - SQL`, sql);
        }

        let outerBuilderB = makeBuilder(args, trx).countDistinct(args.countDistinct);

        const countRes = await outerBuilderB;
        const cnt = countRes[0]['count(`' + opts.idField + '`)'];
        if (args.onlyCount) {
          return cnt;
        }
        count = cnt;
      }

      // are we printing SQL?
      if (args.printSQL) {
        let outerBuilderC = makeBuilder(args, trx);
        // paging
        outerBuilderC = paging(outerBuilderC, args);
        const sql = await outerBuilderC.toString();
        console.log(`${opts.name} - SQL`, sql);
      }

      let finalBuilder = makeBuilder(args, trx);
      // paging
      finalBuilder = paging(finalBuilder, args);

      const rows = await finalBuilder;
      if (args.withCount) {
        return { rows, count };
      }
      return rows;
    } catch (e) {
      log.error(`Error in ${opts.name}.selectAdapter()`, e);
      throw e;
    }
  };
}
