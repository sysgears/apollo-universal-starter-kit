import React from 'react';
import { graphql, compose, withApollo } from 'react-apollo';
// import firebase from 'firebase/app';
// import 'firebase/auth';
// import 'firebase/firestore';

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
        // let firebaseLogin = {};
        // try {
        //   firebaseLogin = await firebase.auth().signInWithEmailAndPassword(usernameOrEmail, password);
        // } catch (e) {
        //   firebaseLogin.error = e;
        //   firebaseLogin.errors = [];
        // }
        // if (firebaseLogin.error) {
        //   if (firebaseLogin.error.code === 'auth/wrong-password') {
        //     firebaseLogin.errors.push({ field: 'password', message: firebaseLogin.error.message });
        //   }
        //   if (firebaseLogin.error.code === 'auth/user-not-found') {
        //     firebaseLogin.errors.push({ field: 'usernameOrEmail', message: firebaseLogin.error.message });
        //   }
        // }
        // const login = {
        //   tokens: null,
        //   user: null,
        //   errors: firebaseLogin.errors
        // };

        // if (firebaseLogin.user) {
        //   const snapshot = await firebase
        //     .firestore()
        //     .collection('users')
        //     .doc(firebaseLogin.user.uid)
        //     .get();
        //   const user = snapshot.data();
        //   login.user = user;
        //   login.tokens = { refreshToken: firebaseLogin.user.refreshToken };
        //   user.__typename = 'User';
        //   user.profile = {};
        //   user.auth = {};
        //   await access.doLogin(client);
        //   await client.writeQuery({ query: CURRENT_USER_QUERY, data: { currentUser: user } });
        //   if (onLogin) {
        //     onLogin();
        //   }
        // }
        return login;
      }
    })
  })
)(Login);

export default LoginWithApollo;
