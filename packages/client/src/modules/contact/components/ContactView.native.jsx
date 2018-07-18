import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import translate from '../../../i18n';
import ContactForm from './ContactForm';

const ContactView = ({ onSubmit }) => {
  return (
    <View style={styles.container}>
      <ContactForm onSubmit={onSubmit} />
    </View>
  );
};

ContactView.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default translate('contact')(ContactView);
