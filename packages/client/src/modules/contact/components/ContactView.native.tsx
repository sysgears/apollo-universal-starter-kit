import React from 'react';
import { StyleSheet, View } from 'react-native';

import ContactForm from './ContactForm.native';
import { ContactProps, Contact, ContactError, SendContactFn } from '../types';

const onSubmit = (contact: SendContactFn) => async (values: Contact) => {
  const result: any = await contact(values);

  if (result.errors) {
    const submitError: any = {
      _error: 'Contact request failed!'
    };
    result.errors.map((error: ContactError) => (submitError[error.field] = error.message));
    throw submitError;
  }
};

const ContactView = ({ contact }: ContactProps) => {
  return (
    <View style={styles.container}>
      <ContactForm onSubmit={onSubmit(contact)} />
    </View>
  );
};

const styles: any = StyleSheet.create({
  container: {
    flexDirection: 'column'
  }
});

export default ContactView;
