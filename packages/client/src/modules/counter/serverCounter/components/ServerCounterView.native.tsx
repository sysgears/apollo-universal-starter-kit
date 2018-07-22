import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button, Loading, primary } from '../../../common/components/native';
import { TranslateFunction } from '../../../../i18n';

interface ViewProps {
  t: TranslateFunction;
  children: any;
  counter: any;
  loading: boolean;
}

export const ServerCounterView = ({ t, children, counter, loading }: ViewProps) => {
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

interface ButtonProps {
  onClick: () => any;
  text: string;
}

export const ServerCounterButton = ({ onClick, text }: ButtonProps) => (
  <Button type={primary} onPress={onClick}>
    {text}
  </Button>
);
