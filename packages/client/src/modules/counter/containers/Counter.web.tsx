import React from 'react';
import { compose } from 'react-apollo';

import { connect, Dispatch } from 'react-redux';
import CounterView from '../components/CounterView.native';

import { withCounter, withCounterAdding, withCounterState, subscriptionOptions } from '../graphql';

import { CounterProps } from '../models';
import { CounterReduxState } from '../reducers';

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
    this.subscription = subscribeToMore(subscriptionOptions);
  }

  public render() {
    return <CounterView {...this.props} />;
  }
}

const CounterWithApollo = compose(withCounter, withCounterAdding, withCounterState)(CounterComponent);

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
