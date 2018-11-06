import React from 'react';
import { StyleSheet, View } from 'react-native';

import ContactForm from './ContactForm';

const ContactView = props => (
  <View style={styles.container}>
    <ContactForm {...props} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default ContactView;
