export default function filterBuilder(queryBuilder, args) {
  let { filters } = args;
  // add filter conditions
  if (filters) {
    if (args.debug && args.debug.filters) {
      console.log('filterBuilder args', args);
    }

    let first = true;
    for (let filter of filters) {
      if (!filter) {
        continue;
      }
      if (filter.applyWhen && !filter.applyWhen(args)) {
        continue;
      }

      if (filter.valueExtractor) {
        filter.value = filter.valueExtractor(args);
      }
      if (filter.valuesExtractor) {
        filter.values = filter.valuesExtractor(args);
      }

      // Pre Filters Recursion
      if (filter.prefilters) {
        let argsClone = Object.assign({}, args);
        argsClone.filters = filter.prefilters;
        if (first) {
          first = false;
          queryBuilder.where(function() {
            filterBuilder(this, argsClone);
          });
        } else {
          if (filter.prefiltersBool === 'and') {
            queryBuilder.andWhere(function() {
              filterBuilder(this, argsClone);
            });
          } else if (filter.prefilterBool === 'or') {
            queryBuilder.orWhere(function() {
              filterBuilder(this, argsClone);
            });
          } else {
            // Default to OR
            queryBuilder.orWhere(function() {
              filterBuilder(this, argsClone);
            });
          }
        }
      }

      // This Filter Visitation
      if (filter.field) {
        let column = filter.field;
        if (filter.table) {
          column = filter.table + '.' + column;
        }

        let compare = '=';
        if (filter.compare) {
          compare = filter.compare;
        }

        let value = filter.value ? filter.value : filter.values;
        if (!value) {
          value = filter.timeValue ? filter.timeValue : filter.timeValues;
          if (!value) {
            value = filter.intValue ? filter.intValue : filter.intValues;
          }
          if (!value) {
            value = filter.floatValue ? filter.floatValue : filter.floatValues;
          }
          if (!value) {
            value = filter.boolValue ? filter.boolValue : filter.boolValues;
          }
        }

        if (first) {
          first = false;
          queryBuilder.where(column, compare, value);
        } else {
          if (filter.bool === 'and') {
            queryBuilder.andWhere(column, compare, value);
          } else if (filter.bool === 'or') {
            queryBuilder.orWhere(column, compare, value);
          } else {
            // Default to OR
            queryBuilder.orWhere(column, compare, value);
          }
        }
      }

      // Post Filters Recursion
      if (filter.postfilters) {
        let argsClone = Object.assign({}, args);
        argsClone.filters = filter.postfilters;
        if (first) {
          first = false;
          queryBuilder.where(function() {
            filterBuilder(this, argsClone);
          });
        } else {
          if (filter.postfiltersBool === 'and') {
            queryBuilder.andWhere(function() {
              filterBuilder(this, argsClone);
            });
          } else if (filter.postfiltersBool === 'or') {
            queryBuilder.orWhere(function() {
              filterBuilder(this, argsClone);
            });
          } else {
            // Default to OR
            queryBuilder.orWhere(function() {
              filterBuilder(this, argsClone);
            });
          }
        }
      }
    }
  }

  return queryBuilder;
}
