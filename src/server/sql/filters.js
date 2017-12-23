import { decamelize } from 'humps';
import { has } from 'lodash';

export function currentFilter(queryBuilder, filter) {
  if (filter) {
    if (has(filter, 'role') && filter.role !== '') {
      queryBuilder.where(function() {
        this.where('u.role', filter.role);
      });
    }

    if (has(filter, 'isActive') && filter.isActive !== null) {
      queryBuilder.where(function() {
        this.where('u.is_active', filter.isActive);
      });
    }

    if (has(filter, 'searchText') && filter.searchText !== '') {
      queryBuilder.where(function() {
        this.where('u.username', 'like', `%${filter.searchText}%`)
          .orWhere('u.email', 'like', `%${filter.searchText}%`)
          .orWhere('up.first_name', 'like', `%${filter.searchText}%`)
          .orWhere('up.last_name', 'like', `%${filter.searchText}%`);
      });
    }
  }

  return queryBuilder;
}

export function filterBuilder(queryBuilder, args) {
  let { filters } = args;

  console.log('FILTERS', filters);

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
