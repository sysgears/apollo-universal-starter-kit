import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import ForgotPasswordForm from './ForgotPasswordForm';

const ForgotPasswordView = ({ onSubmit, sent }) => (
  <View style={styles.forgotPassContainer}>
    <ForgotPasswordForm onSubmit={onSubmit} sent={sent} />
  </View>
);

ForgotPasswordView.propTypes = {
  onSubmit: PropTypes.func,
  sent: PropTypes.bool
};

const styles = StyleSheet.create({
  forgotPassContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch'
  }
});

export default ForgotPasswordView;
