import React from 'react';
import { StyleSheet, View } from 'react-native';

import translate from '../../../i18n';
import { ClientCounter } from '../clientCounter';
import { ReduxCounter } from '../reduxCounter';
import { ServerCounter } from '../serverCounter';
import { TranslateFunc } from '..';

interface CounterProps {
  t: TranslateFunc;
}

const Counter = ({ t }: CounterProps) => (
  <View style={styles.container}>
    <ServerCounter />
    <ReduxCounter />
    <ClientCounter />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 15
  }
});

export default translate('counter')(Counter);
