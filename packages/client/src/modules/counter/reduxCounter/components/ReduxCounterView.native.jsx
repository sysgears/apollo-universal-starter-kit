import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';

import { Button, primary } from '../../../common/components/native';

export const ReduxCounterView = ({ t, children, reduxCount }) => (
  <View>
    <View style={styles.element}>
      <Text style={styles.box}>{t('reduxCounter.text', { reduxCount })}</Text>
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
  t: PropTypes.func,
  children: PropTypes.node,
  reduxCount: PropTypes.number
};

export const ReduxCounterButton = ({ onReduxIncrement, amount, t }) => (
  <Button type={primary} onPress={onReduxIncrement(amount)}>
    {t('reduxCounter.btnLabel')}
  </Button>
);

ReduxCounterButton.propTypes = {
  onReduxIncrement: PropTypes.func,
  amount: PropTypes.number,
  t: PropTypes.func
};
