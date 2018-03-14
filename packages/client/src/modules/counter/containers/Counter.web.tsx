import React from 'react';
import { graphql, compose, NamedProps, QueryProps } from 'react-apollo';
import { SubscribeToMoreOptions, ApolloError } from 'apollo-client';
import update from 'immutability-helper';

import { connect, Dispatch } from 'react-redux';
import CounterView from '../components/CounterView.web';

import COUNTER_QUERY from '../graphql/CounterQuery.graphql';
import ADD_COUNTER from '../graphql/AddCounter.graphql';
import COUNTER_SUBSCRIPTION from '../graphql/CounterSubscription.graphql';
import COUNTER_QUERY_CLIENT from '../graphql/CounterQuery.client.graphql';
import ADD_COUNTER_CLIENT from '../graphql/AddCounter.client.graphql';

interface Counter {
  amount: number;
}

interface CounterProps {
  loading: boolean;
  subscribeToMore: (option: SubscribeToMoreOptions) => void;
  counter: Counter;
  reduxCount: number;
  counterState: number;
  addCounter: (amount: number) => any;
  addCounterState: (amount: number) => any;
  onReduxIncrement: (amount: number) => any;
}

class Counter extends React.Component<CounterProps, any> {
  public subscription: any;
  constructor(props: any) {
    super(props);
    this.subscription = null;
  }

  public componentWillReceiveProps(nextProps: any) {
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
      updateQuery: (prev: any, { subscriptionData: { data: { counterUpdated: { amount } } } }) => {
        return update(prev, {
          $set: amount
        });
      }
    });
  }

  public render() {
    return <CounterView {...this.props} />;
  }
}

interface Counter {
  amount: number;
}

interface CounterResponse {
  counter: Counter;
}

interface CounterState {
  counter: number;
}

interface CounterStateResponse {
  counterState: CounterState;
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
    props: ({ ownProps, mutate }: any) => ({
      addCounter(amount: number) {
        return () =>
          mutate({
            variables: { amount },
            updateQueries: {
              counterQuery: (prev: any, { mutationResult }: any) => {
                const newAmount = mutationResult.data.addCounter.amount;
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
    props: ({ mutate }: any) => ({
      addCounterState: (amount: number): any => () => {
        const { value } = mutate({ variables: { amount } });
        return value;
      }
    })
  }),
  graphql<CounterStateResponse>(COUNTER_QUERY_CLIENT, {
    props: ({ data: { counterState: { counter } } }) => ({ counterState: counter })
  })
)(Counter);

interface ReduxCount {
  reduxCount: number;
}

interface State {
  counter: ReduxCount;
}

export default connect(
  (state: State) => ({ reduxCount: state.counter.reduxCount }),
  (dispatch: Dispatch<any>) => ({
    onReduxIncrement(value: number) {
      return () =>
        dispatch({
          type: 'COUNTER_INCREMENT',
          value: Number(value)
        });
    }
  })
)(CounterWithApollo);
