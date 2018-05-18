import update from 'immutability-helper';

import PRODUCT_STATE_QUERY from '../graphql/ProductStateQuery.client.graphql';

const TYPE_PRODUCT_STATE = 'ProductState';
const TYPE_PRODUCT_STATE_FILTER = 'FilterProductInput';
const TYPE_PRODUCT_STATE_ORDER_BY = 'OrderByProductInput';

// filter data
const defaultFilters = {
  id: '',
  name: '',
  categoryId: '',
  productTypeId: '',
  price: '',
  releaseDate_lte: '',
  releaseDate_gte: '',
  display: '',
  searchText: ''
};
// end filter data

const defaults = {
  productState: {
    limit: 25,
    orderBy: {
      column: '',
      order: '',
      __typename: TYPE_PRODUCT_STATE_ORDER_BY
    },
    filter: {
      ...defaultFilters,
      __typename: TYPE_PRODUCT_STATE_FILTER
    },
    __typename: TYPE_PRODUCT_STATE
  }
};

const resolvers = {
  Mutation: {
    updateProductOrderBy: (_, { orderBy }, { cache }) => {
      const { productState } = cache.readQuery({ query: PRODUCT_STATE_QUERY });

      const newProductState = update(productState, {
        orderBy: { $merge: orderBy }
      });

      cache.writeData({
        data: {
          productState: newProductState,
          __type: TYPE_PRODUCT_STATE
        }
      });

      return null;
    },
    updateProductFilter: (_, { filter }, { cache }) => {
      const { productState } = cache.readQuery({ query: PRODUCT_STATE_QUERY });

      let mergeFilter = filter;
      if (!filter.hasOwnProperty('searchText')) {
        const { searchText, ...restFilters } = defaults.productState.filter;
        mergeFilter = { ...restFilters, ...filter };
      }

      const newProductState = update(productState, {
        filter: { $merge: mergeFilter }
      });

      cache.writeData({
        data: {
          productState: newProductState,
          __type: TYPE_PRODUCT_STATE
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
