import React from 'react';
import { graphql, compose, withApollo } from 'react-apollo';

import LoginView from '../components/LoginView';

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
        const { data: { login } } = await mutate({
          variables: { input: { email, password } }
        });
        if (!login.errors) {
          await client.writeQuery({ query: CURRENT_USER_QUERY, data: { currentUser: login.user } });
          onLogin();
        }
        return login;
      }
    })
  })
)(Login);

export default LoginWithApollo;
