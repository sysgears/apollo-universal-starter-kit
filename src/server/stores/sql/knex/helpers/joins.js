import { decamelize } from 'humps';

/*
 * input is queryBuild (knex object) and args object
 * with field joinClauses: [{joinClause}, ...]
 * where joinClause is:
 *  - type (optional, default:"join"): "join", "inner", "left", "leftOuter", "right", "rightOuter", "outer", "fullOuter"
 *  - table (required)
 *  - args (required, variable) see knex docs
 */
export default function joinBuilder(queryBuilder, args) {
  let { joinClauses } = args;

  // add group by
  if (joinClauses) {
    for (let clause of joinClauses) {
      if (clause) {
        let table = clause.table;
        let args = decamelize(clause.args);
        let join = clause.type;
        if (!join) {
          join = 'join';
        }

        if (join === 'join') {
          queryBuilder.join(table, ...args);
        }
        if (join === 'inner') {
          queryBuilder.innerJoin(table, ...args);
        }
        if (join === 'left') {
          queryBuilder.leftJoin(table, ...args);
        }
        if (join === 'leftOuter') {
          queryBuilder.leftOuterJoin(table, ...args);
        }
        if (join === 'right') {
          queryBuilder.rightJoin(table, ...args);
        }
        if (join === 'rightOuter') {
          queryBuilder.rightOuterJoin(table, ...args);
        }
        if (join === 'outer') {
          queryBuilder.outerJoin(table, ...args);
        }
        if (join === 'fullOuter') {
          queryBuilder.fullOuterJoin(table, ...args);
        }
      }
    }
  }

  return queryBuilder;
}
