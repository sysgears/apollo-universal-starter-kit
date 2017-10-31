import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import { CookieService } from 'angular2-cookie/core';
import * as decode from 'jwt-decode';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import * as LOGIN from '../graphql/Login.graphql';
import * as LOGOUT from '../graphql/Logout.graphql';

enum Events {
  LOGIN = 'login',
  LOGOUT = 'logout'
}

@Injectable()
export default class LoginService {
  private loginEventCbs: any[] = [];
  private logoutEventCbs: any[] = [];

  constructor(private apollo: Apollo, private cookieService: CookieService) {}

  public login(email: string, password: string, callback: (result: any) => any) {
    const login = this.apollo.mutate({
      mutation: LOGIN,
      variables: { input: { email, password } }
    });
    this.subscribe(login, callback, Events.LOGIN);
  }

  public logout(callback: (result: any) => any) {
    const logout = this.apollo.mutate({
      mutation: LOGOUT
    });
    this.subscribe(logout, callback, Events.LOGOUT);
  }

  public setLoginEventCb(cb: any) {
    this.loginEventCbs.push(cb);
  }

  public setLogoutEventCb(cb: any) {
    this.logoutEventCbs.push(cb);
  }

  public loginEvent() {
    this.loginEventCbs.forEach(cb => {
      cb();
    });
  }

  public logoutEvent() {
    this.logoutEventCbs.forEach(cb => {
      cb();
    });
  }

  public checkAuth = (role: string) => {
    let token = null;
    let refreshToken = null;

    const rToken = this.cookieService.get('r-token');
    if (rToken) {
      token = rToken;
      refreshToken = this.cookieService.get('r-refresh-token');
    }
    if (__CLIENT__ && window.localStorage.getItem('token')) {
      token = window.localStorage.getItem('token');
      refreshToken = window.localStorage.getItem('refreshToken');
    }

    if (!token || !refreshToken) {
      return false;
    }

    try {
      const { exp } = decode(refreshToken);

      if (exp < new Date().getTime() / 1000) {
        return false;
      }

      if (role === 'admin') {
        const { user: { isAdmin } } = decode(token);

        if (isAdmin === 0) {
          return false;
        }
      }
    } catch (e) {
      return false;
    }

    return true;
  };

  private subscribe(observable: Observable<any>, cb: (result: Observable<any>) => any, event: string): Subscription {
    const subscription = observable.subscribe({
      next: result => {
        try {
          cb(result);
          if (event === Events.LOGIN) {
            this.loginEvent();
          } else if (event === Events.LOGOUT) {
            this.logoutEvent();
          }
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
