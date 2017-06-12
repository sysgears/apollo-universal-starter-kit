import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';

const [Module]Show = () => {

  return (
    <View style={styles.container}>
      <View style={styles.element}>
        <Text style={styles.box}>
          Hello [Module]!
        </Text>
      </View>
    </View>
  );
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
    marginRight: 15
  }
});

[Module]Show.propTypes = {
};

export default [Module]Show;