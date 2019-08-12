import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { graphql, withApollo } from 'react-apollo';

import { compose } from '@gqlapp/core-common';
import { translate } from '@gqlapp/i18n-client-react';
import { FormError } from '@gqlapp/forms-client-react';

import authentication from '@gqlapp/authentication-client-react';

import LoginView from '../components/LoginView';

import LOGIN from '../graphql/Login.graphql';

const Login = props => {
  const { t, login, client, history } = props;
  const {
    location: { search }
  } = props.history;

  const [isRegistered, setIsRegistered] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (search.includes('email-verified')) {
      setIsRegistered(true);
    }
    setIsReady(true);
  }, [search]);

  const hideModal = () => {
    setIsRegistered(false);
    history.push({ search: '' });
  };

  const onSubmit = async values => {
    try {
      await login(values);
    } catch (e) {
      throw new FormError(t('login.errorMsg'), e);
    }

    await authentication.doLogin(client);
    history.push('/profile');
  };

  return (
    <React.Fragment>
      {isReady && <LoginView {...props} isRegistered={isRegistered} hideModal={hideModal} onSubmit={onSubmit} />}
    </React.Fragment>
  );
};

Login.propTypes = {
  login: PropTypes.func,
  t: PropTypes.func,
  client: PropTypes.object,
  history: PropTypes.object
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
