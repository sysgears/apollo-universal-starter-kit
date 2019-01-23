import React from 'react';
import { graphql, compose, withApollo } from 'react-apollo';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import LoginView from '../components/LoginView';
import access from '../access';

import CURRENT_USER_QUERY from '../graphql/CurrentUserQuery.graphql';
import FEREBASE_LOGIN from '../graphql/FirebaseLogin.graphql';

class Login extends React.Component {
  render() {
    return <LoginView {...this.props} />;
  }
}

const LoginWithApollo = compose(
  withApollo,
  graphql(FEREBASE_LOGIN, {
    props: ({ ownProps: { client, onLogin }, mutate }) => ({
      login: async ({ usernameOrEmail, password }) => {
        let firebaseAuth = {};
        try {
          firebaseAuth = await firebase.auth().signInWithEmailAndPassword(usernameOrEmail, password);
        } catch (e) {
          firebaseAuth.error = e;
          firebaseAuth.errors = [];
        }
        if (firebaseAuth.error) {
          if (firebaseAuth.error.code === 'auth/wrong-password') {
            firebaseAuth.errors.push({ field: 'password', message: firebaseAuth.error.message });
          }
          if (firebaseAuth.error.code === 'auth/user-not-found') {
            firebaseAuth.errors.push({ field: 'usernameOrEmail', message: firebaseAuth.error.message });
          }
        }
        const {
          data: {
            firebaseLogin: { tokens, user, errors }
          }
        } = await mutate({
          variables: { input: { email: usernameOrEmail } }
        });
        const login = { tokens, user, errors };
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

export default LoginWithApollo;
