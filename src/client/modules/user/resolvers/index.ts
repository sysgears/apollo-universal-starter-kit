import { assign, defaults } from 'lodash';

import * as FILTER_STATE_QUERY from '../graphql/FilterState.graphql';
import * as ORDER_BY_STATE_QUERY from '../graphql/OrderByState.graphql';

export interface FilterState {
  searchText: string;
  role: string;
  isActive: boolean;
  orderBy: {};
  __typename: string;
}

const defaultState: FilterState = {
  searchText: '',
  role: '',
  isActive: null,
  orderBy: {},
  __typename: 'FilterState'
};

export default {
  resolvers: {
    Query: {
      filterState: () => defaultState
    },
    Mutation: {
      changeFilterState: (some: any, variables: any, { cache }: any): any => {
        const filterState = cache.readQuery({ query: FILTER_STATE_QUERY });
        const data = {
          filterState: defaults(variables, filterState.filterState)
        };
        cache.writeQuery({ query: FILTER_STATE_QUERY, data });

        return data;
      },
      changeOrderByState: (some: any, { orderBy }: any, { cache }: any): any => {
        const data = {
          orderByState: assign({}, defaultState, { orderBy })
        };
        cache.writeQuery({ query: ORDER_BY_STATE_QUERY, data });
        return data;
      }
    }
  }
};
