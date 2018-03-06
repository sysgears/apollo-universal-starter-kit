import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, StyleSheet } from 'react-native';

import LoginForm from './LoginForm';

class LoginView extends React.PureComponent {
  onSubmit = login => async values => {
    const { errors } = await login(values);

    if (errors && errors.length) {
      throw errors.reduce(
        (res, error) => {
          res[error.field] = error.message;
          return res;
        },
        { _error: 'Login failed!' }
      );
    }
  };

  render() {
    const { login } = this.props;
    return (
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <LoginForm onSubmit={this.onSubmit(login)} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

LoginView.propTypes = {
  login: PropTypes.func.isRequired,
  error: PropTypes.string
};

export default LoginView;
