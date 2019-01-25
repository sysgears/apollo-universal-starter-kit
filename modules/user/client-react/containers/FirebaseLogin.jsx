import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose, withApollo } from 'react-apollo';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { translate } from '@module/i18n-client-react';
import { FormError } from '@module/forms-client-react';

import LoginView from '../components/LoginView';
import access from '../access';

import CURRENT_USER_QUERY from '../graphql/CurrentUserQuery.graphql';
import FEREBASE_LOGIN from '../graphql/FirebaseLogin.graphql';

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
  graphql(FEREBASE_LOGIN, {
    props: ({ mutate }) => ({
      login: async ({ usernameOrEmail, password }) => {
        let firebaseAuth = {};
        try {
          firebaseAuth = await firebase.auth().signInWithEmailAndPassword(usernameOrEmail, password);
        } catch (e) {
          console.log(e);
          const {
            data: {
              firebaseLogin: { user }
            }
          } = await mutate({
            variables: { email: usernameOrEmail, errorCode: e.code }
          });
          return user;
        }
        return firebaseAuth.user;
      }
    })
  })
)(Login);

export default LoginWithApollo;
