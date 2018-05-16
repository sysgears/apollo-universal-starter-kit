import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';

import { Button, primary } from '../../../common/components/native';

export const ClientCounterView = ({ t, children, counterState }) => (
  <View>
    <View style={styles.element}>
      <Text style={styles.box}>{t('clientCounter.text', { counterState })}</Text>
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

ClientCounterView.propTypes = {
  t: PropTypes.func,
  children: PropTypes.node,
  counterState: PropTypes.number
};

export const ClientCounterButton = ({ addCounterState, amount, t }) => (
  <Button type={primary} onPress={addCounterState(amount)}>
    {t('clientCounter.btnLabel')}
  </Button>
);

ClientCounterButton.propTypes = {
  addCounterState: PropTypes.func,
  amount: PropTypes.number,
  t: PropTypes.func
};
