import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose, withApollo } from 'react-apollo';
import { translate } from '@gqlapp/i18n-client-react';
import { FormError } from '@gqlapp/forms-client-react';

import LoginView from '../components/LoginView';
import access from '../access';

import CURRENT_USER_QUERY from '../graphql/CurrentUserQuery.graphql';
import LOGIN from '../graphql/Login.graphql';

class Login extends React.Component {
  static propTypes = {
    login: PropTypes.func,
    onLogin: PropTypes.func,
    t: PropTypes.func,
    client: PropTypes.object
  };

  onSubmit = async values => {
    const { t, login, client, onLogin } = this.props;

    try {
      await login(values);
    } catch (e) {
      throw new FormError(t('login.errorMsg'), e);
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
          data: { login }
        } = await mutate({
          variables: { input: { usernameOrEmail, password } }
        });
        return login;
      }
    })
  })
)(Login);

export default LoginWithApollo;
