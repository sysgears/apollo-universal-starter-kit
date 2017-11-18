import React from 'react';
import PropTypes from 'prop-types';
import { withApollo, graphql, compose } from 'react-apollo';
import ApolloClient from 'apollo-client';
import { Route, Redirect, NavLink, withRouter } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import decode from 'jwt-decode';

import LocalStorage from '../helpers/LocalStorage';
import log from '../../../../common/log';
import CURRENT_USER_QUERY from '../graphql/CurrentUserQuery.graphql';
import LOGOUT from '../graphql/Logout.graphql';

const checkAuth = async (cookies, scope) => {
  let token = null;
  let refreshToken = null;

  if (cookies && cookies.get('r-token')) {
    token = cookies.get('r-token');
    refreshToken = cookies.get('r-refresh-token');
  }
  if (__CLIENT__ && (await LocalStorage.getItem('token'))) {
    token = await LocalStorage.getItem('token');
    refreshToken = await LocalStorage.getItem('refreshToken');
  }

  if (!token || !refreshToken) {
    return false;
  }

  try {
    const { exp } = decode(refreshToken);

    if (exp < new Date().getTime() / 1000) {
      return false;
    }

    if (scope === 'admin') {
      const { user: { role } } = decode(token);
      if (scope !== role) {
        return false;
      }
    }
  } catch (e) {
    return false;
  }

  return true;
};

const profileName = async cookies => {
  let token = null;

  if (cookies && cookies.get('x-token')) {
    token = cookies.get('x-token');
  }

  if (__CLIENT__ && (await LocalStorage.getItem('token'))) {
    token = await LocalStorage.getItem('token');
  }

  if (!token) {
    return '';
  }

  try {
    const { user: { username, fullName } } = decode(token);
    return fullName ? fullName : username;
  } catch (e) {
    return '';
  }
};

class ProfileName extends React.Component {
  async componentDidMount() {
    const { cookies } = this.props;
    this.setState({ fullName: await profileName(cookies) });
  }

  render() {
    return (this.state && this.state.fullName) || '';
  }
}

ProfileName.propTypes = {
  cookies: PropTypes.instanceOf(Cookies)
};

class CheckAuth extends React.Component {
  async componentDidMount() {
    const { cookies, scope } = this.props;
    this.setState({ auth: await checkAuth(cookies, scope) });
  }

  render() {
    const { authorized, nonAuthorized } = this.props;

    if (!this.state) {
      return null;
    } else {
      return this.state.auth ? authorized : nonAuthorized || null;
    }
  }
}

CheckAuth.propTypes = {
  cookies: PropTypes.instanceOf(Cookies),
  scope: PropTypes.string,
  authorized: PropTypes.node,
  nonAuthorized: PropTypes.node
};

const AuthNav = withCookies(({ children, cookies, scope }) => (
  <CheckAuth cookies={cookies} scope={scope} authorized={children} />
));

AuthNav.propTypes = {
  children: PropTypes.object,
  cookies: PropTypes.instanceOf(Cookies)
};

const AuthLogin = ({ children, cookies, logout }) => (
  <CheckAuth
    cookies={cookies}
    authorized={
      <a href="#" onClick={() => logout()} className="nav-link">
        Logout
      </a>
    }
    nonAuthorized={children}
  />
);

AuthLogin.propTypes = {
  client: PropTypes.instanceOf(ApolloClient),
  children: PropTypes.object,
  cookies: PropTypes.instanceOf(Cookies),
  history: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
};

const AuthLoginWithApollo = withCookies(
  withRouter(
    withApollo(
      compose(
        graphql(CURRENT_USER_QUERY),
        graphql(LOGOUT, {
          // eslint-disable-next-line
          props: ({ ownProps: { client, history, navigation }, mutate }) => ({
            logout: async () => {
              try {
                const { data: { logout } } = await mutate();

                if (logout.errors) {
                  return { errors: logout.errors };
                }

                // comment out until https://github.com/apollographql/apollo-client/issues/1186 is fixed
                //await client.resetStore();

                await LocalStorage.setItem('token', null);
                await LocalStorage.setItem('refreshToken', null);

                if (history) {
                  return history.push('/');
                }
                if (navigation) {
                  return navigation.goBack();
                }
              } catch (e) {
                log.error(e.stack);
              }
            }
          })
        })
      )(AuthLogin)
    )
  )
);

const AuthProfile = withCookies(({ cookies }) => (
  <CheckAuth
    cookies={cookies}
    authorized={
      <NavLink to="/profile" className="nav-link" activeClassName="active">
        <ProfileName cookies={cookies} />
      </NavLink>
    }
  />
));

AuthProfile.propTypes = {
  cookies: PropTypes.instanceOf(Cookies)
};

const AuthRoute = withCookies(({ component: Component, cookies, scope, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      <CheckAuth
        cookies={cookies}
        scope={scope}
        authorized={<Component {...props} />}
        nonAuthorized={<Redirect to={{ pathname: '/login' }} />}
      />
    )}
  />
));

AuthRoute.propTypes = {
  component: PropTypes.func,
  cookies: PropTypes.instanceOf(Cookies),
  scope: PropTypes.string
};

export { AuthNav };
export { AuthProfile };
export { AuthLoginWithApollo as AuthLogin };
export { AuthRoute };
