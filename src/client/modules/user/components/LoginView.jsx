import React from 'react';
import PropTypes from 'prop-types';
import { SubmissionError } from 'redux-form';
import { ScrollView, StyleSheet } from 'react-native';

import LoginForm from '../components/LoginForm';

class LoginView extends React.PureComponent {
  onSubmit = login => async values => {
    const result = await login(values);

    if (result.errors) {
      let submitError = {
        _error: 'Login failed!'
      };
      result.errors.map(error => (submitError[error.field] = error.message));
      throw new SubmissionError(submitError);
    }
  };

  render() {
    const { login } = this.props;

    //    <CardTitle>Available logins:</CardTitle>
    //  <CardText>admin@example.com:admin</CardText>
    //  <CardText>user@example.com:user</CardText>
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
