import React from 'react';
import { StyleSheet, View } from 'react-native';

import { translate } from '@gqlapp/i18n-client-react';
import counters from '../counters';

const Counter = () => (
  <View style={styles.container}>
    {counters.counterComponent.map((component: any, idx: number, items: any) =>
      React.cloneElement(component, { key: idx + items.length })
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
});

export default translate('counter')(Counter);
