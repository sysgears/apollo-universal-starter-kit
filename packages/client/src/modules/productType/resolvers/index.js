import update from 'immutability-helper';

import PRODUCTTYPE_STATE_QUERY from '../graphql/ProductTypeStateQuery.client.graphql';

const TYPE_PRODUCTTYPE_STATE = 'ProductTypeState';
const TYPE_PRODUCTTYPE_STATE_FILTER = 'FilterProductTypeInput';
const TYPE_PRODUCTTYPE_STATE_ORDER_BY = 'OrderByProductTypeInput';

// filter data
const defaultFilters = {
  id: '',
  name: '',
  description: '',
  rank: '',
  searchText: ''
};
// end filter data

const defaults = {
  productTypeState: {
    limit: 25,
    orderBy: {
      column: '',
      order: '',
      __typename: TYPE_PRODUCTTYPE_STATE_ORDER_BY
    },
    filter: {
      ...defaultFilters,
      __typename: TYPE_PRODUCTTYPE_STATE_FILTER
    },
    __typename: TYPE_PRODUCTTYPE_STATE
  }
};

const resolvers = {
  Mutation: {
    updateProductTypeOrderBy: (_, { orderBy }, { cache }) => {
      const { productTypeState } = cache.readQuery({ query: PRODUCTTYPE_STATE_QUERY });

      const newProductTypeState = update(productTypeState, {
        orderBy: { $merge: orderBy }
      });

      cache.writeData({
        data: {
          productTypeState: newProductTypeState,
          __type: TYPE_PRODUCTTYPE_STATE
        }
      });

      return null;
    },
    updateProductTypeFilter: (_, { filter }, { cache }) => {
      const { productTypeState } = cache.readQuery({ query: PRODUCTTYPE_STATE_QUERY });

      let mergeFilter = filter;
      if (!filter.hasOwnProperty('searchText')) {
        const { searchText, ...restFilters } = defaults.productTypeState.filter;
        mergeFilter = { ...restFilters, ...filter };
      }

      const newProductTypeState = update(productTypeState, {
        filter: { $merge: mergeFilter }
      });

      cache.writeData({
        data: {
          productTypeState: newProductTypeState,
          __type: TYPE_PRODUCTTYPE_STATE
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
