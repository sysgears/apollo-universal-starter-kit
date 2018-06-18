import update from 'immutability-helper';

import SUBCATEGORY_STATE_QUERY from '../graphql/SubCategoryStateQuery.client.graphql';

const TYPE_SUBCATEGORY_STATE = 'SubCategoryState';
const TYPE_SUBCATEGORY_STATE_FILTER = 'FilterSubCategoryInput';
const TYPE_SUBCATEGORY_STATE_ORDER_BY = 'OrderBySubCategoryInput';

// filter data
const defaultFilters = {
  id: '',
  name: '',
  description: '',
  categoryId: '',
  searchText: ''
};
// end filter data

const defaults = {
  subCategoryState: {
    limit: 25,
    orderBy: {
      column: '',
      order: '',
      __typename: TYPE_SUBCATEGORY_STATE_ORDER_BY
    },
    filter: {
      ...defaultFilters,
      __typename: TYPE_SUBCATEGORY_STATE_FILTER
    },
    __typename: TYPE_SUBCATEGORY_STATE
  }
};

const resolvers = {
  Mutation: {
    updateSubCategoryOrderBy: (_, { orderBy }, { cache }) => {
      const { subCategoryState } = cache.readQuery({ query: SUBCATEGORY_STATE_QUERY });

      const newSubCategoryState = update(subCategoryState, {
        orderBy: { $merge: orderBy }
      });

      cache.writeData({
        data: {
          subCategoryState: newSubCategoryState,
          __type: TYPE_SUBCATEGORY_STATE
        }
      });

      return null;
    },
    updateSubCategoryFilter: (_, { filter }, { cache }) => {
      const { subCategoryState } = cache.readQuery({ query: SUBCATEGORY_STATE_QUERY });

      let mergeFilter = filter;
      if (!filter.hasOwnProperty('searchText')) {
        const { searchText, ...restFilters } = defaults.subCategoryState.filter;
        mergeFilter = { ...restFilters, ...filter };
      }

      const newSubCategoryState = update(subCategoryState, {
        filter: { $merge: mergeFilter }
      });

      cache.writeData({
        data: {
          subCategoryState: newSubCategoryState,
          __type: TYPE_SUBCATEGORY_STATE
        }
      });

      return null;
    }
  }
};

export default {
  defaults,
  resolvers
};
