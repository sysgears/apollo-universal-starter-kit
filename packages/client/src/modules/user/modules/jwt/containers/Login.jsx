/* eslint-disable no-undef */
// React
import React from 'react';
import { AsyncStorage } from 'react-native';

// Apollo
import { graphql, compose, withApollo } from 'react-apollo';

// Components
import LoginView from '../../../common/components/LoginView';
import log from '../../../../../../../common/log';

import CURRENT_USER_QUERY from '../graphql/CurrentUserQuery.graphql';
import LOGIN from '../graphql/Login.graphql';

class Login extends React.Component {
  render() {
    return <LoginView {...this.props} />;
  }
}

const LoginWithApollo = compose(
  withApollo,
  graphql(LOGIN, {
    props: ({ ownProps: { client, onLogin }, mutate }) => ({
      login: async ({ email, password }) => {
        try {
          const { data: { login } } = await mutate({
            variables: { input: { email, password } }
          });
          const { token, refreshToken } = login.tokens;
          await AsyncStorage.setItem('token', token);
          await AsyncStorage.setItem('refreshToken', refreshToken);
          if (login.errors) {
            return { errors: login.errors };
          }
          await client.writeQuery({ query: CURRENT_USER_QUERY, data: { currentUser: login.user } });
          onLogin();
        } catch (e) {
          log.error(e);
        }
      }
    })
  })
)(Login);

export default LoginWithApollo;
