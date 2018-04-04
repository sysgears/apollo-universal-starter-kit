import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import ForgotPasswordForm from './ForgotPasswordForm';

class ForgotPassword extends React.Component {
  static propTypes = {
    forgotPassword: PropTypes.func.isRequired
  };

  state = {
    sent: false
  };

  onSubmit = ({ forgotPassword }) => async values => {
    const result = await forgotPassword(values);
    if (result && result.errors) {
      throw result.errors.reduce(
        (res, error) => {
          res[error.field] = error.message;
          return res;
        },
        { _error: 'Forgot password failed!' }
      );
    }

    this.setState({ sent: true });
  };

  render() {
    const { forgotPassword } = this.props;

    return (
      <View style={styles.forgotPassContainer}>
        <ForgotPasswordForm onSubmit={this.onSubmit({ forgotPassword })} sent={this.state.sent} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  forgotPassContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch'
  }
});

export default ForgotPassword;
