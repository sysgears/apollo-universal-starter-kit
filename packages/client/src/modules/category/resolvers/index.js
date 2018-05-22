import update from 'immutability-helper';

import CATEGORY_STATE_QUERY from '../graphql/CategoryStateQuery.client.graphql';

const TYPE_CATEGORY_STATE = 'CategoryState';
const TYPE_CATEGORY_STATE_FILTER = 'FilterCategoryInput';
const TYPE_CATEGORY_STATE_ORDER_BY = 'OrderByCategoryInput';

// filter data
const defaultFilters = {
  id: '',
  name: '',
  parentId: '',
  products: '',
  searchText: ''
};
// end filter data

const defaults = {
  categoryState: {
    limit: 25,
    orderBy: {
      column: '',
      order: '',
      __typename: TYPE_CATEGORY_STATE_ORDER_BY
    },
    filter: {
      ...defaultFilters,
      __typename: TYPE_CATEGORY_STATE_FILTER
    },
    __typename: TYPE_CATEGORY_STATE
  }
};

const resolvers = {
  Mutation: {
    updateCategoryOrderBy: (_, { orderBy }, { cache }) => {
      const { categoryState } = cache.readQuery({ query: CATEGORY_STATE_QUERY });

      const newCategoryState = update(categoryState, {
        orderBy: { $merge: orderBy }
      });

      cache.writeData({
        data: {
          categoryState: newCategoryState,
          __type: TYPE_CATEGORY_STATE
        }
      });

      return null;
    },
    updateCategoryFilter: (_, { filter }, { cache }) => {
      const { categoryState } = cache.readQuery({ query: CATEGORY_STATE_QUERY });

      let mergeFilter = filter;
      if (!filter.hasOwnProperty('searchText')) {
        const { searchText, ...restFilters } = defaults.categoryState.filter;
        mergeFilter = { ...restFilters, ...filter };
      }

      const newCategoryState = update(categoryState, {
        filter: { $merge: mergeFilter }
      });

      cache.writeData({
        data: {
          categoryState: newCategoryState,
          __type: TYPE_CATEGORY_STATE
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
