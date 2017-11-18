/* eslint-disable no-undef */
import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';

import LoginView from '../components/LoginView';
import LOGIN from '../graphql/Login.graphql';
import LocalStorage from '../helpers/LocalStorage';

class Login extends React.Component {
  render() {
    return <LoginView {...this.props} />;
  }
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  data: PropTypes.object
};

const LoginWithApollo = compose(
  graphql(LOGIN, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      login: async ({ email, password }) => {
        try {
          const { data: { login } } = await mutate({
            variables: { input: { email, password } }
          });

          console.log('email:', email, 'pwd:', password, 'result:', login);

          if (login.errors) {
            return { errors: login.errors };
          }

          const { token, refreshToken } = login.tokens;
          await LocalStorage.setItem('token', token);
          await LocalStorage.setItem('refreshToken', refreshToken);

          if (history) {
            return history.push('/profile');
          }
          if (navigation) {
            return navigation.goBack();
          }
        } catch (e) {
          console.log(e.stack);
        }
      }
    })
  })
)(Login);

export default LoginWithApollo;
