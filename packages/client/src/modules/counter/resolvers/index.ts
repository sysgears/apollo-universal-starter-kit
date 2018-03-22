import COUNTER_QUERY_CLIENT from '../graphql/CounterQuery.client.graphql';
import { Counter } from '../types';

const TYPE_NAME = 'Amount';

interface ApolloCounter extends Counter {
  __typename: string;
}

export interface CounterApolloState {
  stateCounter: ApolloCounter;
}

const defaults: CounterApolloState = {
  stateCounter: {
    amount: 1,
    __typename: TYPE_NAME
  }
};

const resolvers = {
  Query: {
    stateCounter: (_: any, args: any, { cache }: any) => {
      const { counter } = cache.readQuery({ query: COUNTER_QUERY_CLIENT });
      return counter;
    }
  },
  Mutation: {
    addStateCounter: async (_: any, { value }: any, { cache }: any): Promise<boolean> => {
      const { stateCounter: { amount } } = cache.readQuery({ query: COUNTER_QUERY_CLIENT });
      const newAmount: number = amount + value;

      await cache.writeData({
        data: {
          stateCounter: {
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
