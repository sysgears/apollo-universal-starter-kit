import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import translate from '../../../i18n';
import ContactForm from './ContactForm';

const onSubmit = (contact, t) => async values => {
  const result = await contact(values);

  if (result.errors) {
    let submitError = {
      _error: t('errorMsg')
    };
    result.errors.map(error => (submitError[error.field] = error.message));
    throw submitError;
  }
};

const ContactView = ({ contact, t }) => {
  return (
    <View style={styles.container}>
      <ContactForm onSubmit={onSubmit(contact, t)} />
    </View>
  );
};

ContactView.propTypes = {
  contact: PropTypes.func.isRequired,
  t: PropTypes.func
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default translate('contact')(ContactView);
