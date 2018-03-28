import { graphql, OptionProps, compose } from 'react-apollo';
import { ApolloError } from 'apollo-client';
import { SubscriptionResult } from '../../../../../common/types';
import update from 'immutability-helper';

import COUNTER_QUERY from './CounterQuery.graphql';
import ADD_COUNTER from './AddCounter.graphql';
import COUNTER_QUERY_CLIENT from './CounterQuery.client.graphql';
import ADD_COUNTER_CLIENT from './AddCounter.client.graphql';
import COUNTER_SUBSCRIPTION from '../graphql/CounterSubscription.graphql';

import { CounterOperation, CounterQueryResult, CounterUpdatedResult } from '../types';
import { CounterApolloState } from '../resolvers';

/**
 * Counter subscription options.
 */
const subscriptionOptions = {
  document: COUNTER_SUBSCRIPTION,
  variables: {},
  updateQuery: (
    prev: CounterQueryResult,
    { subscriptionData: { data: { counterUpdated: { amount } } } }: SubscriptionResult<CounterUpdatedResult>
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

/**
 * Provides a Counter entity.
 *
 * @param Component to be wrapped with the HOC
 */
const withCounter = Component =>
  graphql(COUNTER_QUERY, {
    props: ({ data: { loading, error, counter, subscribeToMore } }: OptionProps<any, CounterQueryResult>) => {
      if (error) {
        throw new ApolloError(error);
      }
      return { loading, counter, subscribeToMore };
    }
  })(Component);

/**
 * Updates a Counter by aggregating an amount.
 *
 * @param Component to be wrapped with the HOC
 */
const withCounterAdding = Component =>
  graphql(ADD_COUNTER, {
    props: ({ ownProps, mutate }: OptionProps<any, CounterOperation>) => ({
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
  })(Component);

/**
 * Provides the Apollo State Counter operations.
 *
 * @param Component to be wrapped with the HOC
 */
const withCounterState = Component =>
  compose(
    graphql(ADD_COUNTER_CLIENT, {
      props: ({ mutate }: OptionProps<any, CounterOperation>) => ({
        addStateCounter: (value: number): any => () => mutate({ variables: { value } })
      })
    }),
    graphql(COUNTER_QUERY_CLIENT, {
      props: ({ data: { stateCounter } }: OptionProps<any, CounterApolloState>) => ({ stateCounter })
    })
  )(Component);

/* --- EXPORTS --- */

export { subscriptionOptions };
export { withCounter, withCounterAdding };
export { withCounterState };
