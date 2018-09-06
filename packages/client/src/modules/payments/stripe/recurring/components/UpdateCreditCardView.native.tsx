import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SubscriptionCardForm from './SubscriptionCardFormView';

export default ({ t }: any) => (
  <View style={styles.container}>
    <Text>Hi UPDATE CARD</Text>
    <SubscriptionCardForm />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  }
});
