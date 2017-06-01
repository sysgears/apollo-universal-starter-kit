import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';

import AMOUNT_QUERY from '../client/modules/counter/graphql/count_get.graphql';
import COUNT_SUBSCRIPTION from '../client/modules/counter/graphql/count_subscribe.graphql';

import TestReactNativeWeb from '../client/modules/counter/containers/testReactNative';

class Counter extends Component {
  constructor(props) {
    super(props);

    this.subscription = null;
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.loading) {
      if (this.subscription) {
        this.subscription();
        this.subscription = null;
      }

      // Subscribe or re-subscribe
      if (!this.subscription) {
        this.subscribeToCount();
      }
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription();
    }
  }

  handleReduxIncrement = (e) => {
    let value;
    if (e && e.target) {
      value = e.target.value;
    } else {
      value = e;
    }

    this.props.onReduxIncrement(value);
  }

  subscribeToCount() {
    const { subscribeToMore } = this.props;
    this.subscription = subscribeToMore({
      document: COUNT_SUBSCRIPTION,
      variables: {},
      updateQuery: (prev, {subscriptionData: {data: {countUpdated: { amount }}}}) => {
        return update(prev, {
          count: {
            amount: {
              $set: amount,
            },
          }
        });
      }
    });
  }

  render() {
    const { loading, count } = this.props;

    if (loading) {
      return (
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text>Current count, is {count.amount}.</Text>
          <TestReactNativeWeb/>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

Counter.propTypes = {
  loading: PropTypes.bool.isRequired,
  count: PropTypes.object,
  subscribeToMore: PropTypes.func.isRequired,
};

export default compose(
  graphql(AMOUNT_QUERY, {
    props({ data: { loading, count, subscribeToMore } }) {
      return { loading, count, subscribeToMore };
    }
  }),
)(Counter);
