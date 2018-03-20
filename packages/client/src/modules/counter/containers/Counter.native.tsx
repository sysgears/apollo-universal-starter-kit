import React from 'react';
import { graphql, compose, OptionProps } from 'react-apollo';
import { SubscribeToMoreOptions, ApolloError } from 'apollo-client';
import update from 'immutability-helper';

import { connect, Dispatch } from 'react-redux';
import CounterView from '../components/CounterView.native';

import COUNTER_QUERY from '../graphql/CounterQuery.graphql';
import ADD_COUNTER from '../graphql/AddCounter.graphql';
import COUNTER_SUBSCRIPTION from '../graphql/CounterSubscription.graphql';
import COUNTER_QUERY_CLIENT from '../graphql/CounterQuery.client.graphql';
import ADD_COUNTER_CLIENT from '../graphql/AddCounter.client.graphql';

interface Counter {
  counter: Amount;
}

interface Amount {
  amount: number;
}

interface CounterProps {
  loading: boolean;
  subscribeToMore: (option: SubscribeToMoreOptions) => void;
  counter: Amount;
  reduxCount: number;
  counterState: number;
  addCounter: (amount: number) => any;
  addCounterState: (amount: number) => any;
  onReduxIncrement: (amount: number) => any;
}

interface CounterResponse {
  counter: Amount;
}

interface CounterOperation {
  addCounter?: (amount: number) => any;
  addCounterState?: (amount: number) => any;
}

interface CounterState {
  counter: number;
}

interface CounterStateResponse {
  counterState: CounterState;
}

interface ReduxCount {
  reduxCount: number;
}

interface CounterReduxState {
  counter: ReduxCount;
}

class Counter extends React.Component<CounterProps, any> {
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
      updateQuery: (prev: Counter, { subscriptionData: { data: { counterUpdated: { amount } } } }) => {
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
  graphql<CounterResponse>(COUNTER_QUERY, {
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
              counterQuery: (prev: Counter, { mutationResult }: any) => {
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
      addCounterState: (amount: number): any => () => {
        const result: Promise<any> = mutate({ variables: { amount } });
        return result;
      }
    })
  }),
  graphql<CounterStateResponse>(COUNTER_QUERY_CLIENT, {
    props: ({ data: { counterState: { counter } } }) => ({ counterState: counter })
  })
)(Counter);

export default connect(
  (state: CounterReduxState) => ({ reduxCount: state.counter.reduxCount }),
  (dispatch: Dispatch<CounterReduxState>) => ({
    onReduxIncrement(value: number) {
      return () =>
        dispatch({
          type: 'COUNTER_INCREMENT',
          value: Number(value)
        });
    }
  })
)(CounterWithApollo);
