import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';

import { Button, primary } from '../../../common/components/native';

export const ServerCounterView = ({ t, children, counter }) => (
  <View>
    <View style={styles.element}>
      <Text style={styles.box}>{t('serverCounter.text', { counter })}</Text>
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

ServerCounterView.propTypes = {
  t: PropTypes.func,
  children: PropTypes.node,
  counter: PropTypes.object
};

export const ServerCounterButton = ({ addCounter, amount, t }) => (
  <Button type={primary} onPress={addCounter(amount)}>
    {t('serverCounter.btnLabel')}
  </Button>
);

ServerCounterButton.propTypes = {
  addCounter: PropTypes.func,
  amount: PropTypes.number,
  t: PropTypes.func
};
