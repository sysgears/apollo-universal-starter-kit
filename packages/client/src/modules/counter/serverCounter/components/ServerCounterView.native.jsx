import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';

import { Button, Loading, primary } from '../../../common/components/native';

export const ServerCounterView = ({ t, children, counter, loading }) => {
  if (loading) {
    return <Loading text={t('loading')} />;
  } else {
    return (
      <View>
        <View style={styles.element}>
          <Text style={styles.box}>{t('text', { amount: counter.amount })}</Text>
        </View>
        {children}
      </View>
    );
  }
};

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
  counter: PropTypes.object,
  loading: PropTypes.bool
};

export const ServerCounterButton = ({ onClick, text }) => (
  <Button type={primary} onPress={onClick}>
    {text}
  </Button>
);

ServerCounterButton.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string
};
