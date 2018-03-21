import React from 'react';
import { graphql, compose, OptionProps } from 'react-apollo';
import { SubscribeToMoreOptions, ApolloError } from 'apollo-client';
import update from 'immutability-helper';

import { connect, Dispatch } from 'react-redux';
import CounterView from '../components/CounterView.web';

import COUNTER_QUERY from '../graphql/CounterQuery.graphql';
import ADD_COUNTER from '../graphql/AddCounter.graphql';
import COUNTER_SUBSCRIPTION from '../graphql/CounterSubscription.graphql';
import COUNTER_QUERY_CLIENT from '../graphql/CounterQuery.client.graphql';
import ADD_COUNTER_CLIENT from '../graphql/AddCounter.client.graphql';

import { Counter } from '../models';
import { CounterReduxState } from '../reducers';
import { CounterApolloState } from '../resolvers';

interface CounterOperation {
  addCounter?: (amount: number) => any;
  addStateCounter?: (amount: number) => any;
}

interface CounterOperationResult {
  counter: Counter;
  loading: boolean;
  subscribeToMore: (option: SubscribeToMoreOptions) => void;
}

interface CounterProps extends CounterOperationResult {
  reduxCounter: Counter;
  stateCounter: Counter;
  addCounter: (amount: number) => any;
  addStateCounter: (amount: number) => any;
  onReduxIncrement: (amount: number) => any;
}

class CounterComponent extends React.Component<CounterProps, any> {
  public subscription: any;
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
      updateQuery: (prev: CounterOperationResult, { subscriptionData: { data: { counterUpdated: { amount } } } }) => {
        return update(prev, {
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
  graphql<CounterOperationResult>(COUNTER_QUERY, {
    props({ data: { loading, error, counter, subscribeToMore } }) {
      if (error) {
        throw new ApolloError(error);
      }
      return { loading, counter, subscribeToMore };
    }
  }),
  graphql(ADD_COUNTER, {
    props: ({ ownProps, mutate }: OptionProps<any, CounterOperation>) => ({
      addCounter(amount: number) {
        return () =>
          mutate({
            variables: { amount },
            updateQueries: {
              counterQuery: (prev: CounterOperationResult, { mutationResult }: any) => {
                const newAmount: number = mutationResult.data.addCounter.amount;
                return update(prev, {
                  counter: {
                    amount: {
                      $set: newAmount
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
    props: ({ mutate }: OptionProps<any, CounterOperation>) => ({
      addStateCounter: (value: number): any => () => {
        mutate({ variables: { value } });
      }
    })
  }),
  graphql<CounterApolloState>(COUNTER_QUERY_CLIENT, {
    props: ({ data: { stateCounter } }) => ({ stateCounter })
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
