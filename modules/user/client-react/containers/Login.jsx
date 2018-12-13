import React from 'react';
import { graphql, compose, withApollo } from 'react-apollo';
import { translate } from '@module/i18n-client-react';
import { FieldError } from '@module/validation-common-react';

import LoginView from '../components/LoginView';
import access from '../access';

import CURRENT_USER_QUERY from '../graphql/CurrentUserQuery.graphql';
import LOGIN from '../graphql/Login.graphql';

class Login extends React.Component {
  onSubmit = async values => {
    const { t, login } = this.props;
    const errors = new FieldError((await login(values)).errors);

    throw { ...errors.errors, handleErr: t('login.errorMsg') };
  };

  render() {
    return <LoginView {...this.props} onSubmit={this.onSubmit} />;
  }
}

const LoginWithApollo = compose(
  withApollo,
  graphql(LOGIN, {
    props: ({ ownProps: { client, onLogin }, mutate }) => ({
      login: async ({ usernameOrEmail, password }) => {
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
)(Login);

export default translate('user')(LoginWithApollo);
