import React from 'react';
import { StyleSheet, View } from 'react-native';

import { TranslateFunction } from '@module/i18n-client-react';
import ContactForm from './ContactForm';
import { ContactForm as IContactForm } from '../types';

interface ContactViewProps {
  t: TranslateFunction;
  onSubmit: (values: IContactForm) => Promise<{ errors: Array<{ field: string; message: string }> }>;
}

const ContactView = (props: ContactViewProps) => (
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
