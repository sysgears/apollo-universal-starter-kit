import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

import RegisterForm from '../components/RegisterForm';

export default class RegisterView extends React.PureComponent {
  static propTypes = {
    register: PropTypes.func.isRequired
  };

  onSubmit = async values => {
    const { register } = this.props;
    const { errors } = await register(values);

    if (errors && errors.length) {
      throw errors.reduce(
        (res, error) => {
          res[error.field] = error.message;
          return res;
        },
        { _error: 'Registration failed!' }
      );
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <RegisterForm onSubmit={this.onSubmit} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'stretch',
    flex: 1
  }
});
