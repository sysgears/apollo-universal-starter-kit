import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text } from 'react-native';

import settings from '../../../../../../settings';

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

  renderAvailableLogins = () => (
    <View style={styles.examplesArea}>
      <Text style={styles.title}>Available logins:</Text>
      <Text style={styles.exampleText}>admin@example.com: admin</Text>
      <Text style={styles.exampleText}>user@example.com: user</Text>
      {settings.subscription.enabled && <Text style={styles.exampleText}>subscriber@example.com: subscriber</Text>}
    </View>
  );

  render() {
    const { login } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.examplesContainer}>{this.renderAvailableLogins()}</View>
        <View style={styles.loginContainer}>
          <LoginForm onSubmit={this.onSubmit(login)} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: 10
  },
  examplesArea: {
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: '#8e908c',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e3e3e3',
    padding: 10
  },
  examplesContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#8e908c'
  },
  exampleText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#8e908c'
  },
  loginContainer: {
    flex: 3
  }
});

LoginView.propTypes = {
  login: PropTypes.func.isRequired,
  error: PropTypes.string
};

export default LoginView;
