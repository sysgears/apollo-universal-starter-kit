import React from 'react';
import { graphql, compose, withApollo } from 'react-apollo';
import { translate } from '@module/i18n-client-react';
// import { FieldError } from '@module/validation-common-react';
import withSubmit from './withSubmit';

import LoginView from '../components/LoginView';
import access from '../access';

import CURRENT_USER_QUERY from '../graphql/CurrentUserQuery.graphql';
import LOGIN from '../graphql/Login.graphql';

class Login extends React.Component {
  render() {
    return <LoginView {...this.props} />;
  }
}

const LoginWithApollo = compose(
  withApollo,
  translate('user'),
  graphql(LOGIN, {
    props: ({ ownProps: { client, onLogin }, mutate }) => ({
      handleRequest: async ({ usernameOrEmail, password }) => {
        const {
          data: { login }
        } = await mutate({
          variables: { input: { usernameOrEmail, password } }
        });
        if (!login.errors) {
          await access.doLogin(client);
          await client.writeQuery({ query: CURRENT_USER_QUERY, data: { currentUser: login.user } });
          if (onLogin) {
            onLogin();
          }
        }
        return login;
      }
    })
  })
)(withSubmit(Login, 'login'));

export default LoginWithApollo;
