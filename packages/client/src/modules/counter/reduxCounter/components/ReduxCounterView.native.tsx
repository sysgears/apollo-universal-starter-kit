import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';

import { Button, primary } from '../../../common/components/native';

export const ReduxCounterView = ({ text, children }) => (
  <View>
    <View style={styles.element}>
      <Text style={styles.box}>{text}</Text>
    </View>
    {children}
  </View>
);

const styles = StyleSheet.create({
  element: {
    paddingTop: 30
  },
  box: {
    textAlign: 'center',
    marginBottom: 5
  }
});

ReduxCounterView.propTypes = {
  text: PropTypes.string,
  children: PropTypes.node
};

export const ReduxCounterButton = ({ onClick, text }) => (
  <Button type={primary} onPress={onClick}>
    {text}
  </Button>
);

ReduxCounterButton.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string
};
