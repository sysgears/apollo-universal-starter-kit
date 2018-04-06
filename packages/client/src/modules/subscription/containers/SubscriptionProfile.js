import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';

import CardInfo from './CardInfo';
import CancelSubscription from './CancelSubscription';

const SubscriptionProfile = () => {
  return Platform.OS === 'web' ? (
    <div>
      <CardInfo />
      <CancelSubscription />
    </div>
  ) : (
    <View>
      <View style={styles.subscriptionItem}>
        <CardInfo />
      </View>
      <View style={styles.subscriptionItem}>
        <CancelSubscription />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  subscriptionItem: {
    marginBottom: 15
  }
});

export default SubscriptionProfile;
