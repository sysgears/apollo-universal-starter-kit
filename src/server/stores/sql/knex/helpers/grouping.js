import { decamelize } from 'humps';

/*
 * input is queryBuild (knex object) and args object
 * with field groupBys: [{groupBy}, ...]
 * where groupBy: {column, table}
 * (table is optional)
 */
export default function grouping(queryBuilder, args) {
  let { groupBys } = args;

  // add group by
  if (groupBys) {
    for (let groupBy of groupBys) {
      if (groupBy && groupBy.column) {
        let column = groupBy.column;
        if (groupBy.table) {
          column = groupBy.table + '.' + column;
        }
        column = decamelize(column);

        queryBuilder.groupBy(column);
      }
    }
  }

  return queryBuilder;
}
