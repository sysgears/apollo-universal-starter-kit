import update from 'immutability-helper';

import USERS_STATE_QUERY from '../graphql/UsersStateQuery.client.graphql';

const TYPE_USERS_STATE = 'UsersState';
const TYPE_USERS_STATE_FILTER = 'FilterUserInput';
const TYPE_USERS_STATE_ORDER_BY = 'OrderByUserInput';

const defaults = {
  usersState: {
    orderBy: {
      column: '',
      order: '',
      __typename: TYPE_USERS_STATE_ORDER_BY
    },
    filter: {
      searchText: '',
      role: '',
      isActive: true,
      __typename: TYPE_USERS_STATE_FILTER
    },
    __typename: TYPE_USERS_STATE
  }
};

const resolvers = {
  Mutation: {
    updateOrderBy: (_, { orderBy }, { cache }) => {
      const { usersState } = cache.readQuery({ query: USERS_STATE_QUERY });

      const newUsersState = update(usersState, {
        orderBy: { $merge: orderBy }
      });

      cache.writeData({
        data: {
          usersState: newUsersState,
          __type: TYPE_USERS_STATE
        }
      });

      return null;
    },
    updateFilter: (_, { filter }, { cache }) => {
      const { usersState } = cache.readQuery({ query: USERS_STATE_QUERY });

      const newUsersState = update(usersState, {
        filter: { $merge: filter }
      });

      cache.writeData({
        data: {
          usersState: newUsersState,
          __type: TYPE_USERS_STATE
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
