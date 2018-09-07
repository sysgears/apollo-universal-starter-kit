import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

import SubscriptionCardForm from './SubscriptionCardFormView';

// TODO: translate
export default (props: any) => {
  const { t } = props;
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.textWrapper}>
          <Text style={styles.infoText}>To get magic PRIVATE number you should subscribe!</Text>
        </View>
        <View style={styles.cardFormWrapper}>
          <SubscriptionCardForm {...props} buttonName="Subscribe" />
        </View>
      </ScrollView>
    </View>
  );
};
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
