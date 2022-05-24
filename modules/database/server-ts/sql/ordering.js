export default function ordering(queryBuilder, args) {
  const { orderBys } = args;

  // add order by
  if (orderBys) {
    for (const orderBy of orderBys) {
      // checks to short circuit
      if (!orderBy) {
        continue;
      }
      if (orderBy.applyWhen && !orderBy.applyWhen(args)) {
        continue;
      }

      // let's get orderly
      if (orderBy && orderBy.column) {
        let { column } = orderBy;
        if (orderBy.table) {
          column = `${orderBy.table}.${column}`;
        }

        let order = 'asc';
        if (orderBy.order) {
          order = orderBy.order;
        }

        queryBuilder.orderBy(column, order);
      }
    } // end of loop over orderBys
  }

  return queryBuilder;
}
