import { decamelize } from 'humps';

export default function filterBuilder(queryBuilder, args) {
  let { filters } = args;

  // add filter conditions
  if (filters) {
    let first = true;
    for (let filter of filters) {
      // Pre Filters Recursion
      if (filter.prefilters) {
        if (first) {
          first = false;
          queryBuilder.where(function() {
            filterBuilder(this, { filters: filter.prefilters });
          });
        } else {
          if (filter.filterBool === 'and') {
            queryBuilder.andWhere(function() {
              filterBuilder(this, { filters: filter.prefilters });
            });
          } else if (filter.filterBool === 'or') {
            queryBuilder.orWhere(function() {
              filterBuilder(this, { filters: filter.prefilters });
            });
          } else {
            // Default to OR
            queryBuilder.orWhere(function() {
              filterBuilder(this, { filters: filter.prefilters });
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
        column = decamelize(column);

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
        if (first) {
          first = false;
          queryBuilder.where(function() {
            filterBuilder(this, { filters: filter.postfilters });
          });
        } else {
          if (filter.filterBool === 'and') {
            queryBuilder.andWhere(function() {
              filterBuilder(this, { filters: filter.postfilters });
            });
          } else if (filter.filterBool === 'or') {
            queryBuilder.orWhere(function() {
              filterBuilder(this, { filters: filter.postfilters });
            });
          } else {
            // Default to OR
            queryBuilder.orWhere(function() {
              filterBuilder(this, { filters: filter.postfilters });
            });
          }
        }
      }
    }
  }

  return queryBuilder;
}
