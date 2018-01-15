import { decamelize } from 'humps';

export function currentOrdering(queryBuilder, orderBy) {
  if (orderBy && orderBy.column) {
    let column = orderBy.column;
    let order = 'asc';
    if (orderBy.order) {
      order = orderBy.order;
    }

    queryBuilder.orderBy(decamelize(column), order);
  }

  return queryBuilder;
}

export function ordering(queryBuilder, args) {
  let { orderBys } = args;

  // add order by
  if (orderBys) {
    for (let orderBy of orderBys) {
      if (orderBy && orderBy.column) {
        let column = orderBy.column;
        if (orderBy.table) {
          column = orderBy.table + '.' + column;
        }
        column = decamelize(column);

        let order = 'asc';
        if (orderBy.order) {
          order = orderBy.order;
        }
        queryBuilder.orderBy(column, order);
      }
    }
  }

  return queryBuilder;
}
