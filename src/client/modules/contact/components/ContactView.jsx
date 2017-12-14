import React from 'react';
import PropTypes from 'prop-types';
import { SubmissionError } from 'redux-form';
import { StyleSheet, View } from 'react-native';

import ContactForm from './ContactForm';

const onSubmit = (contact, onFormSubmitted) => async values => {
  const result = await contact(values);

  if (result.errors) {
    let submitError = {
      _error: 'Contact request failed!'
    };
    result.errors.map(error => (submitError[error.field] = error.message));
    throw new SubmissionError(submitError);
  }
  onFormSubmitted();
};

const ContactView = ({ contact, onFormSubmitted }) => {
  return (
    <View style={styles.container}>
      <ContactForm onSubmit={onSubmit(contact, onFormSubmitted)} />
    </View>
  );
};

ContactView.propTypes = {
  contact: PropTypes.func.isRequired,
  onFormSubmitted: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column'
  }
});

export default ContactView;
