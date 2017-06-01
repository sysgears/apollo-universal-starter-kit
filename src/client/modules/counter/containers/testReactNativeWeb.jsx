import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';

export default class TestReactNativeWeb extends Component {
  render() {
    return (
      <View>
        <Text style={styles.title}>Test React Native Web. {Platform.OS}</Text>
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