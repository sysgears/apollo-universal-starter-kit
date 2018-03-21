import React from 'react';
import { graphql, compose, OptionProps } from 'react-apollo';
import { ApolloError } from 'apollo-client';
import update from 'immutability-helper';

import { connect, Dispatch } from 'react-redux';
import CounterView from '../components/CounterView.native';

import COUNTER_QUERY from '../graphql/CounterQuery.graphql';
import ADD_COUNTER from '../graphql/AddCounter.graphql';
import COUNTER_SUBSCRIPTION from '../graphql/CounterSubscription.graphql';
import COUNTER_QUERY_CLIENT from '../graphql/CounterQuery.client.graphql';
import ADD_COUNTER_CLIENT from '../graphql/AddCounter.client.graphql';

import { Counter, CounterOperation, CounterQueryResult, CounterProps } from '../models';
import { CounterReduxState } from '../reducers';
import { CounterApolloState } from '../resolvers';

class CounterComponent extends React.Component<CounterProps, any> {
  private subscription: any;

  constructor(props: CounterProps) {
    super(props);
    this.subscription = null;
  }

  public componentWillReceiveProps(nextProps: CounterProps) {
    if (!nextProps.loading) {
      // Subscribe or re-subscribe
      if (!this.subscription) {
        this.subscribeToCount();
      }
    }
  }

  public componentWillUnmount() {
    if (this.subscription) {
      this.subscription();
    }
  }

  public subscribeToCount() {
    const { subscribeToMore } = this.props;
    this.subscription = subscribeToMore({
      document: COUNTER_SUBSCRIPTION,
      variables: {},
      updateQuery: (prev: CounterQueryResult, { subscriptionData: { data: { counterUpdated: { amount } } } }) => {
        return update<CounterQueryResult>(prev, {
          counter: {
            amount: {
              $set: amount
            }
          }
        });
      }
    });
  }

  public render() {
    return <CounterView {...this.props} />;
  }
}

const CounterWithApollo = compose(
  // TODO: move queries and mutations out of the component to make them reusable
  graphql(COUNTER_QUERY, {
    props: ({ data: { loading, error, counter, subscribeToMore } }: OptionProps<CounterProps, CounterQueryResult>) => {
      if (error) {
        throw new ApolloError(error);
      }
      return { loading, counter, subscribeToMore };
    }
  }),
  graphql(ADD_COUNTER, {
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
  }),
  graphql(ADD_COUNTER_CLIENT, {
    props: ({ mutate }: OptionProps<CounterProps, CounterOperation>) => ({
      addStateCounter: (value: number): any => () => mutate({ variables: { value } })
    })
  }),
  graphql(COUNTER_QUERY_CLIENT, {
    props: ({ data: { stateCounter } }: OptionProps<CounterProps, CounterApolloState>) => ({ stateCounter })
  })
)(CounterComponent);

export default connect(
  (state: any) => ({ reduxCounter: state.counter.counter }),
  (dispatch: Dispatch<CounterReduxState>) => ({
    onReduxIncrement(value: number) {
      return () =>
        dispatch({
          type: 'COUNTER_INCREMENT',
          value
        });
    }
  })
)(CounterWithApollo);
