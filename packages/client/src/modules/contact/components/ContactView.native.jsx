import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import ContactForm from './ContactForm';

const onSubmit = contact => async values => {
  const result = await contact(values);

  if (result.errors) {
    let submitError = {
      _error: 'Contact request failed!'
    };
    result.errors.map(error => (submitError[error.field] = error.message));
    throw submitError;
  }
};

const ContactView = ({ contact }) => {
  return (
    <View style={styles.container}>
      <ContactForm onSubmit={onSubmit(contact)} />
    </View>
  );
};

ContactView.propTypes = {
  contact: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column'
  }
});

export default ContactView;
