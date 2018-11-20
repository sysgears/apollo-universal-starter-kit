import COUNTER_QUERY_CLIENT from '../graphql/CounterQuery.client.graphql';

const TYPE_NAME = 'ClientCounter';

const defaults = {
  clientCounter: {
    amount: 1,
    __typename: TYPE_NAME
  }
};

const resolvers = {
  Query: {
    clientCounter: (_: any, args: any, { cache }: any) => {
      const {
        clientCounter: { amount }
      } = cache.readQuery({ query: COUNTER_QUERY_CLIENT });
      return {
        amount,
        __typename: TYPE_NAME
      };
    }
  },
  Mutation: {
    addClientCounter: async (_: any, { increment }: any, { cache }: any): Promise<any> => {
      const {
        clientCounter: { amount }
      } = cache.readQuery({ query: COUNTER_QUERY_CLIENT });
      const newAmount = amount + increment;
      await cache.writeData({
        data: {
          clientCounter: {
            amount: newAmount,
            __typename: TYPE_NAME
          }
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
