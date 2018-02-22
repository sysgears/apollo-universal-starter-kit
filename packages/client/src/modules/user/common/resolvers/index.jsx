import USER_ACTION_QUERY from '../graphql/UserActions.client.graphql';

const TYPE_NAME = 'UserAction';

const defaults = {
  action: 'NotLogin',
  __typename: TYPE_NAME
};

const resolvers = {
  Query: {
    userAction: (_, args, { cache }) => {
      const { action: { action } } = cache.readQuery({ query: USER_ACTION_QUERY });
      return {
        action: action,
        __typename: TYPE_NAME
      };
    }
  },
  Mutation: {
    changeAction: async (_, { action }, { cache }) => {
      await cache.writeData({
        data: {
          action,
          __typename: TYPE_NAME
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
