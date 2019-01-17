import React from 'react';
import { graphql, compose, withApollo } from 'react-apollo';
import { translate } from '@module/i18n-client-react';
import { FormErrors } from '@module/forms-client-react';

import LoginView from '../components/LoginView';
import access from '../access';

import CURRENT_USER_QUERY from '../graphql/CurrentUserQuery.graphql';
import LOGIN from '../graphql/Login.graphql';

class Login extends React.Component {
  onSubmit = async values => {
    const { t, login, client, onLogin } = this.props;

    try {
      await login(values);
    } catch (e) {
      throw new FormErrors(e, t('login.errorMsg'));
    }

    await access.doLogin(client);
    await client.writeQuery({ query: CURRENT_USER_QUERY, data: { currentUser: login.user } });
    if (onLogin) {
      onLogin();
    }
  };

  render() {
    return <LoginView {...this.props} onSubmit={this.onSubmit} />;
  }
}

const LoginWithApollo = compose(
  withApollo,
  translate('user'),
  graphql(LOGIN, {
    props: ({ mutate }) => ({
      login: async ({ usernameOrEmail, password }) => {
        const {
          data: { login, error }
        } = await mutate({
          variables: { input: { usernameOrEmail, password } }
        });
        console.log('error', error);
        return login;
      }
    })
  })
)(Login);

export default LoginWithApollo;
