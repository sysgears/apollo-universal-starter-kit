import React from 'react';
import { StyleSheet, Text, View, TextStyle } from 'react-native';

import { Loading } from '@gqlapp/look-client-react-native';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';

interface ViewProps {
  children: any;
  t: TranslateFunction;
  counter: any;
  loading: boolean;
}

export const ClientCounterView = ({ children, counter, t, loading }: ViewProps) => {
  if (loading) {
    return <Loading text={t('loading')} />;
  } else {
    return (
      <View>
        <View style={styles.element}>
          <Text style={styles.box as TextStyle}>{t('text', { amount: counter.amount })}</Text>
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

export default translate('clientCounter')(ClientCounterView);
