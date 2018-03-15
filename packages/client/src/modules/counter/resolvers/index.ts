import COUNTER_QUERY_CLIENT from '../graphql/CounterQuery.client.graphql';

const TYPE_NAME = 'CounterState';

interface CounterState {
  counter: number;
  __typename: string;
}

interface Defaults {
  counterState: CounterState;
}

const defaults: Defaults = {
  counterState: {
    counter: 1,
    __typename: TYPE_NAME
  }
};

const resolvers = {
  Query: {
    counterState: (_: any, args: any, { cache }: any) => {
      const { counterState: { counter } } = cache.readQuery({ query: COUNTER_QUERY_CLIENT });
      return {
        counter,
        __typename: TYPE_NAME
      };
    }
  },
  Mutation: {
    addCounterState: async (_: any, { amount }: any, { cache }: any): Promise<boolean> => {
      const { counterState: { counter } } = cache.readQuery({ query: COUNTER_QUERY_CLIENT });
      const newAmount: number = amount + counter;

      await cache.writeData({
        data: {
          counterState: {
            counter: newAmount,
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
