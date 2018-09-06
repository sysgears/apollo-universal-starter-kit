import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

import SubscriptionCardForm from './SubscriptionCardFormView';
import { Button, primary } from '../../../../common/components/native';

// TODO: translate
export default ({ t }: any) => (
  <View style={styles.container}>
    <ScrollView>
      <View style={styles.textWrapper}>
        <Text style={styles.infoText}>To get magic PRIVATE number you should subscribe!</Text>
      </View>
      <View style={styles.cardFormWrapper}>
        <SubscriptionCardForm />
      </View>
      <View style={styles.buttonWrapper}>
        <Button color={primary}>Subscribe</Button>
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
  },
  buttonWrapper: {
    padding: 10,
    zIndex: 100
  }
});
