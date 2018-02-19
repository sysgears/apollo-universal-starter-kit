import update from 'immutability-helper';

import TESTMODULE_STATE_QUERY from '../graphql/TestModuleStateQuery.client.graphql';

const TYPE_TESTMODULE_STATE = 'TestModuleState';
const TYPE_TESTMODULE_STATE_FILTER = 'FilterTestModuleInput';
const TYPE_TESTMODULE_STATE_ORDER_BY = 'OrderByTestModuleInput';

const defaults = {
  testModuleState: {
    orderBy: {
      column: '',
      order: '',
      __typename: TYPE_TESTMODULE_STATE_ORDER_BY
    },
    filter: {
      searchText: '',
      __typename: TYPE_TESTMODULE_STATE_FILTER
    },
    __typename: TYPE_TESTMODULE_STATE
  }
};

const resolvers = {
  Mutation: {
    updateTestModuleOrderBy: (_, { orderBy }, { cache }) => {
      const { testModuleState } = cache.readQuery({ query: TESTMODULE_STATE_QUERY });

      const newTestModuleState = update(testModuleState, {
        orderBy: { $merge: orderBy }
      });

      cache.writeData({
        data: {
          testModuleState: newTestModuleState,
          __type: TYPE_TESTMODULE_STATE
        }
      });

      return null;
    },
    updateTestModuleFilter: (_, { filter }, { cache }) => {
      const { testModuleState } = cache.readQuery({ query: TESTMODULE_STATE_QUERY });
      const newTestModuleState = update(testModuleState, {
        filter: { $merge: filter }
      });

      cache.writeData({
        data: {
          testModuleState: newTestModuleState,
          __type: TYPE_TESTMODULE_STATE
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
