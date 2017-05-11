import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';

import AMOUNT_QUERY from '../graphql/count_get.graphql';

class Counter extends Component {
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
};

export default compose(
  graphql(AMOUNT_QUERY, {
    props({ data: { loading, count } }) {
      return { loading, count };
    }
  }),
)(Counter);
