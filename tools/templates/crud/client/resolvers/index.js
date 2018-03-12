import update from 'immutability-helper';

import $MODULE$_STATE_QUERY from '../graphql/$Module$StateQuery.client.graphql';

const TYPE_$MODULE$_STATE = '$Module$State';
const TYPE_$MODULE$_STATE_FILTER = 'Filter$Module$Input';
const TYPE_$MODULE$_STATE_ORDER_BY = 'OrderBy$Module$Input';

// filter data
const defaultFilters = {
  id: '',
  name: '',
  searchText: ''
};
// end filter data

const defaults = {
  $module$State: {
    limit: 25,
    orderBy: {
      column: '',
      order: '',
      __typename: TYPE_$MODULE$_STATE_ORDER_BY
    },
    filter: {
      ...defaultFilters,
      __typename: TYPE_$MODULE$_STATE_FILTER
    },
    __typename: TYPE_$MODULE$_STATE
  }
};

const resolvers = {
  Mutation: {
    update$Module$OrderBy: (_, { orderBy }, { cache }) => {
      const { $module$State } = cache.readQuery({ query: $MODULE$_STATE_QUERY });

      const new$Module$State = update($module$State, {
        orderBy: { $merge: orderBy }
      });

      cache.writeData({
        data: {
          $module$State: new$Module$State,
          __type: TYPE_$MODULE$_STATE
        }
      });

      return null;
    },
    update$Module$Filter: (_, { filter }, { cache }) => {
      const { $module$State } = cache.readQuery({ query: $MODULE$_STATE_QUERY });

      let mergeFilter = filter;
      if (!filter.hasOwnProperty('searchText')) {
        const { searchText, ...restFilters } = defaults.$module$State.filter;
        mergeFilter = { ...restFilters, ...filter };
      }

      const new$Module$State = update($module$State, {
        filter: { $merge: mergeFilter }
      });

      cache.writeData({
        data: {
          $module$State: new$Module$State,
          __type: TYPE_$MODULE$_STATE
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
