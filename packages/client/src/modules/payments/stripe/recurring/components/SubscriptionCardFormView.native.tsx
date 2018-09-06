import React from 'react';
import { StyleSheet, View } from 'react-native';
// @ts-ignore
import { CreditCardInput } from 'react-native-credit-card-input';

export default ({ t }: any) => (
  <View style={styles.container}>
    <CreditCardInput onChange={(props: any) => console.log(props)} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  }
});
