/*
 * input is queryBuild (knex object) and args object
 * with field groupBys: [{groupBy}, ...]
 * where groupBy: {column, table}
 * (table is optional)
 */
export default function grouping(queryBuilder, args) {
  const { groupBys } = args;

  // add group by
  if (groupBys) {
    for (const groupBy of groupBys) {
      if (!groupBy) {
        continue;
      }
      if (groupBy.applyWhen && !groupBy.applyWhen(args)) {
        continue;
      }
      if (groupBy && groupBy.column) {
        let { column } = groupBy;
        if (groupBy.table) {
          column = `${groupBy.table}.${column}`;
        }

        queryBuilder.groupBy(column);
      }
    }
  }

  return queryBuilder;
}
