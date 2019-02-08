import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose, withApollo } from 'react-apollo';
import firebase from 'firebase/app';
import 'firebase/auth';
import { translate } from '@gqlapp/i18n-client-react';
import { FormError } from '@gqlapp/forms-client-react';

import LoginView from '../components/LoginView';
import access from '../access';

import LOGIN from '../graphql/Login.graphql';
import LOGIN_WITH_PROVIDER from '../graphql/LoginWithProvider.graphql';

class Login extends React.Component {
  static propTypes = {
    login: PropTypes.func,
    onLogin: PropTypes.func,
    t: PropTypes.func,
    client: PropTypes.object
  };

  onSubmit = async values => {
    const { t, login, client, onLogin } = this.props;
    console.log(values);
    try {
      await login(values);
    } catch (e) {
      throw new FormError(t('login.errorMsg'), e);
    }

    await access.doLogin(client);
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
  translate('firebase'),
  graphql(LOGIN, {
    props: ({ mutate }) => ({
      login: async ({ email, password }) => {
        // Mutate for check isActive status before firebase auth
        await mutate({
          variables: { input: { email } }
        });
        let firebaseAuth = {};
        let result;
        try {
          firebaseAuth = await firebase.auth().signInWithEmailAndPassword(email, password);
        } catch (e) {
          firebaseAuth.code = e.code;
        } finally {
          let token = '';
          if (firebaseAuth.user) {
            token = await firebase.auth().currentUser.getIdToken(true);
          }
          const {
            data: {
              login: { user }
            }
          } = await mutate({
            variables: { input: { email, errorCode: firebaseAuth.code, token } }
          });
          result = user;
        }
        return result;
      }
    })
  }),
  graphql(LOGIN_WITH_PROVIDER, {
    props: ({ mutate }) => ({
      loginWithProvider: async (
        { uid, email: emailUser, emailVerified },
        { providerId, profile: { name, id, email: emailProfile, verified_email }, isNewUser }
      ) => {
        const userInput = {
          id: uid,
          email: emailUser || emailProfile,
          emailVerified: emailVerified || verified_email
        };
        const provider = {
          providerId,
          isNewUser,
          profileId: id,
          name
        };
        const result = await mutate({
          variables: { input: { ...userInput, provider } }
        });
        return result;
      }
    })
  })
)(Login);

export default LoginWithApollo;
