import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import ForgotPasswordForm from './ForgotPasswordForm';

class ForgotPasswordView extends React.PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func,
    sent: PropTypes.bool,
  };

  render() {
    const { onSubmit, sent } = this.props;
    return (
      <View style={styles.forgotPassContainer}>
        <ForgotPasswordForm onSubmit={onSubmit} sent={sent} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  forgotPassContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
});

export default ForgotPasswordView;
