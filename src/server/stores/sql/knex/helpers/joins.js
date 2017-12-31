/*
 * input is queryBuild (knex object) and args object
 * with field joinClauses: [{joinClause}, ...]
 * where joinClause is:
 *  - type (optional, default:"join"): "join", "inner", "left", "leftOuter", "right", "rightOuter", "outer", "fullOuter"
 *  - table (required)
 *  - args (required, variable) see knex docs
 */
export default function joinBuilder(queryBuilder, args) {
  let { joins } = args;

  // add group by
  if (joins) {
    for (let clause of joins) {
      if (clause) {
        if (clause.applyWhen && !clause.applyWhen(args)) {
          continue;
        }
        let table = clause.table;
        let joinArgs = clause.args;
        let join = clause.type;
        if (!join) {
          join = 'join';
        }

        if (join === 'join') {
          queryBuilder.join(table, ...joinArgs);
        }
        if (join === 'inner') {
          queryBuilder.innerJoin(table, ...joinArgs);
        }
        if (join === 'left') {
          queryBuilder.leftJoin(table, ...joinArgs);
        }
        if (join === 'leftOuter') {
          queryBuilder.leftOuterJoin(table, ...joinArgs);
        }
        if (join === 'right') {
          queryBuilder.rightJoin(table, ...joinArgs);
        }
        if (join === 'rightOuter') {
          queryBuilder.rightOuterJoin(table, ...joinArgs);
        }
        if (join === 'outer') {
          queryBuilder.outerJoin(table, ...joinArgs);
        }
        if (join === 'fullOuter') {
          queryBuilder.fullOuterJoin(table, ...joinArgs);
        }
      }
    }
  }

  return queryBuilder;
}
