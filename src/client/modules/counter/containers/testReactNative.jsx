import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class TestReactNativeWeb extends Component {
  render() {
    return (
      <View>
        <Text style={styles.title}>NATIVE</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 20,
  },
});