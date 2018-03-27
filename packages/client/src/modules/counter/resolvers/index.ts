import COUNTER_QUERY_CLIENT from '../graphql/CounterQuery.client.graphql';
import { Counter } from '../types';
import { ApolloTypeName } from '../../../../../common/types';

const TYPE_NAME = 'Amount';

export interface CounterApolloState {
  stateCounter: ApolloTypeName & Counter;
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
    addStateCounter: (_: any, { value }: any, { cache }: any): any => {
      const { stateCounter: { amount } } = cache.readQuery({ query: COUNTER_QUERY_CLIENT });
      const newAmount: number = amount + value;

      cache.writeData({
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
