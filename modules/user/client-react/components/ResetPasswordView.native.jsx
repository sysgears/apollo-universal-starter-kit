import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

import ResetPasswordForm from './ResetPasswordForm';

const ResetPasswordView = ({ onSubmit }) => (
  <View style={styles.container}>
    <ResetPasswordForm onSubmit={onSubmit} />
  </View>
);

ResetPasswordView.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'stretch',
    flex: 1
  }
});

export default ResetPasswordView;
