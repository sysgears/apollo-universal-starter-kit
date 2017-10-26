import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import * as LOGIN from '../graphql/Login.graphql';

@Injectable()
export default class LoginService {
  constructor(private apollo: Apollo) {}

  public login(email: string, password: string, callback: (result: any) => any) {
    const login = this.apollo.mutate({
      mutation: LOGIN,
      variables: { input: { email, password } }
    });
    this.subscribe(login, callback);
  }

  private subscribe(observable: Observable<any>, cb: (result: Observable<any>) => any): Subscription {
    const subscription = observable.subscribe({
      next: result => {
        try {
          cb(result);
        } catch (e) {
          setImmediate(() => {
            subscription.unsubscribe();
          });
        }
      }
    });
    return subscription;
  }
}

// /* eslint-disable no-undef */
// // React
// import React from 'react';
// import PropTypes from 'prop-types';
//
// // Apollo
// import { graphql, compose } from 'react-apollo';
//
// // Components
// import LoginView from '../components/LoginView';
//
// import LOGIN from '../graphql/Login.graphql';
//
// class Login extends React.Component {
//   render() {
//     return <LoginView {...this.props} />;
//   }
// }
//
// Login.propTypes = {
//   login: PropTypes.func.isRequired,
//   data: PropTypes.object
// };
//
// const LoginWithApollo = compose(
//   graphql(LOGIN, {
//     props: ({ ownProps: { history, navigation }, mutate }) => ({
//       login: async ({ email, password }) => {
//         try {
//           const { data: { login } } = await mutate({
//             variables: { input: { email, password } }
//           });
//
//           if (login.errors) {
//             return { errors: login.errors };
//           }
//
//           const { token, refreshToken } = login.tokens;
//           localStorage.setItem('token', token);
//           localStorage.setItem('refreshToken', refreshToken);
//
//           if (history) {
//             return history.push('/profile');
//           }
//           if (navigation) {
//             return navigation.goBack();
//           }
//         } catch (e) {
//           console.log(e.graphQLErrors);
//         }
//       }
//     })
//   })
// )(Login);
//
// export default LoginWithApollo;
