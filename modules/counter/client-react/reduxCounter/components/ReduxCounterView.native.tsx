import React from 'react';
import { StyleSheet, Text, View, TextStyle } from 'react-native';

import { Button, primary } from '../../../../../packages/client/src/modules/common/components/native';

interface ViewProps {
  text: string;
  children: any;
}

export const ReduxCounterView = ({ text, children }: ViewProps) => (
  <View>
    <View style={styles.element}>
      <Text style={styles.box as TextStyle}>{text}</Text>
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

interface ButtonProps {
  onClick: () => any;
  text: string;
}

export const ReduxCounterButton = ({ onClick, text }: ButtonProps): any => (
  <Button type={primary} onPress={onClick}>
    {text}
  </Button>
);
