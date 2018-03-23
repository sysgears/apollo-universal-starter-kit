import { graphql, OptionProps, compose } from 'react-apollo';
import { ApolloError } from 'apollo-client';
import { SubscriptionData } from '../../../../../common/types';
import update from 'immutability-helper';

import COUNTER_QUERY from './CounterQuery.graphql';
import ADD_COUNTER from './AddCounter.graphql';
import COUNTER_QUERY_CLIENT from './CounterQuery.client.graphql';
import ADD_COUNTER_CLIENT from './AddCounter.client.graphql';
import COUNTER_SUBSCRIPTION from '../graphql/CounterSubscription.graphql';

import { Counter, CounterOperation, CounterQueryResult, CounterProps } from '../types';
import { CounterApolloState } from '../resolvers';

interface CounterUpdated {
  counterUpdated: Counter;
}

const subscriptionOptions = {
  document: COUNTER_SUBSCRIPTION,
  variables: {},
  updateQuery: (
    prev: CounterQueryResult,
    { subscriptionData: { data: { counterUpdated: { amount } } } }: SubscriptionData<CounterUpdated>
  ) => {
    return update<CounterQueryResult>(prev, {
      counter: {
        amount: {
          $set: amount
        }
      }
    });
  }
};

const withCounter = graphql(COUNTER_QUERY, {
  props: ({ data: { loading, error, counter, subscribeToMore } }: OptionProps<CounterProps, CounterQueryResult>) => {
    if (error) {
      throw new ApolloError(error);
    }
    return { loading, counter, subscribeToMore };
  }
});

const withCounterAdding = graphql(ADD_COUNTER, {
  props: ({ ownProps, mutate }: OptionProps<CounterProps, CounterOperation>) => ({
    addCounter(amount: number) {
      return () =>
        mutate({
          variables: { amount },
          updateQueries: {
            counterQuery: (prev: CounterQueryResult, { mutationResult }: any) => {
              return update(prev, {
                counter: {
                  amount: {
                    $set: mutationResult.data.addCounter.amount
                  }
                }
              });
            }
          },
          optimisticResponse: {
            __typename: 'Mutation',
            addCounter: {
              __typename: 'Counter',
              amount: ownProps.counter.amount + 1
            }
          }
        });
    }
  })
});

const withCounterState = compose(
  graphql(ADD_COUNTER_CLIENT, {
    props: ({ mutate }: OptionProps<CounterProps, CounterOperation>) => ({
      addStateCounter: (value: number): any => () => mutate({ variables: { value } })
    })
  }),
  graphql(COUNTER_QUERY_CLIENT, {
    props: ({ data: { stateCounter } }: OptionProps<CounterProps, CounterApolloState>) => ({ stateCounter })
  })
);

export { withCounter, withCounterAdding, withCounterState, subscriptionOptions };
