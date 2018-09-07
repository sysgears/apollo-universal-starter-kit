import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import SubscriptionCardForm from './SubscriptionCardFormView';

export default (props: any) => (
  <View style={styles.container}>
    <ScrollView>
      <View style={styles.cardFormWrapper}>
        <SubscriptionCardForm {...props} buttonName="Update Card" />
      </View>
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  textWrapper: {
    margin: 10
  },
  infoText: {
    fontSize: 18,
    textAlign: 'center'
  },
  cardFormWrapper: {
    padding: 10,
    margin: 10
  }
});
