import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose, withApollo } from 'react-apollo';
import { translate } from '@gqlapp/i18n-client-react';
import { FormError } from '@gqlapp/forms-client-react';

import authentication from '@gqlapp/authentication-client-react';

import LoginView from '../components/LoginView';

import CURRENT_USER_QUERY from '../graphql/CurrentUserQuery.graphql';
import LOGIN from '../graphql/Login.graphql';

const Login = props => {
  const { t, login, client } = props;

  const onSubmit = async values => {
    try {
      await login(values);
    } catch (e) {
      throw new FormError(t('login.errorMsg'), e);
    }

    await authentication.doLogin(client);
    await client.writeQuery({ query: CURRENT_USER_QUERY, data: { currentUser: login.user } });
  };

  return <LoginView {...props} onSubmit={onSubmit} />;
};

Login.propTypes = {
  login: PropTypes.func,
  t: PropTypes.func,
  client: PropTypes.object
};

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
