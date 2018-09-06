import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default ({ t }: any) => (
  <View style={styles.container}>
    <Text>Hi FORM CARD</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  }
});
