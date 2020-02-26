import update from 'immutability-helper';
import { mergeFilter } from '@gqlapp/core-common';

import { $Module$Schema } from '@gqlapp/$-module$-server-ts/schema';
import $MODULE$_STATE_QUERY from '../graphql/$Module$StateQuery.client.graphql';

const TYPE_$MODULE$_STATE = '$Module$State';
const TYPE_$MODULE$_STATE_FILTER = 'Filter$Module$Input';
const TYPE_$MODULE$_STATE_ORDER_BY = 'OrderBy$Module$Input';

// filter data
const defaultFilters = {
  searchText: '',
  id: '',
  name_contains: ''
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
    update$Module$Limit: (_, { limit }, { cache }) => {
      const { $module$State } = cache.readQuery({ query: $MODULE$_STATE_QUERY });

      const new$Module$State = update($module$State, {
        limit: { $set: limit }
      });

      cache.writeData({
        data: {
          $module$State: new$Module$State,
          __type: TYPE_$MODULE$_STATE
        }
      });

      return null;
    },
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
      const new$Module$State = update($module$State, {
        filter: { $merge: mergeFilter(filter, defaultFilters, $Module$Schema) }
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
