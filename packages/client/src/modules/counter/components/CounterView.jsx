import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../../common/components';

const CounterView = ({ loading, counter, addCounter, reduxCount, onReduxIncrement }) => {
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.element}>
          <Text style={styles.box}>
            Current counter, is {counter.amount}. This is being stored server-side in the database and using Apollo
            subscription for real-time updates.
          </Text>
        </View>
        <Button onPress={addCounter(1)}>Click to increase counter</Button>
        <View style={styles.element}>
          <Text style={styles.box}>
            Current reduxCount, is {reduxCount}. This is being stored client-side with Redux.
          </Text>
        </View>
        <Button onPress={onReduxIncrement(1)}>Click to increase reduxCount</Button>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  element: {
    paddingTop: 30
  },
  box: {
    textAlign: 'center',
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 5
  }
});

CounterView.propTypes = {
  loading: PropTypes.bool.isRequired,
  counter: PropTypes.object,
  addCounter: PropTypes.func.isRequired,
  reduxCount: PropTypes.number.isRequired,
  onReduxIncrement: PropTypes.func.isRequired
};

export default CounterView;
