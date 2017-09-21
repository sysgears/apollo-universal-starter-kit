import React from 'react';
import PropTypes from 'prop-types';
import { withApollo, graphql, compose } from 'react-apollo';
import ApolloClient from 'apollo-client';
import { Route, Redirect, NavLink, withRouter } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import decode from 'jwt-decode';

import CURRENT_USER_QUERY from '../graphql/CurrentUserQuery.graphql';
import LOGOUT from '../graphql/Logout.graphql';

const checkAuth = (cookies, role) => {
  let token = null;
  let refreshToken = null;

  if (cookies && cookies.get('r-token')) {
    token = cookies.get('r-token');
    refreshToken = cookies.get('r-refresh-token');
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

const profileName = cookies => {
  let token = null;

  if (cookies && cookies.get('x-token')) {
    token = cookies.get('x-token');
  }

  if (__CLIENT__ && window.localStorage.getItem('token')) {
    token = window.localStorage.getItem('token');
  }

  if (!token) {
    return '';
  }

  try {
    const { user: { username } } = decode(token);
    return username;
  } catch (e) {
    return '';
  }
};

const AuthNav = withCookies(({ children, cookies, role }) => {
  return checkAuth(cookies, role) ? children : null;
});

AuthNav.propTypes = {
  children: PropTypes.object,
  cookies: PropTypes.instanceOf(Cookies)
};

const AuthLogin = ({ children, cookies, logout }) => {
  return checkAuth(cookies, '') ? (
    <a href="#" onClick={() => logout()} className="nav-link">
      Logout
    </a>
  ) : (
    children
  );
};

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

                window.localStorage.setItem('token', null);
                window.localStorage.setItem('refreshToken', null);

                if (history) {
                  return history.push('/');
                }
                if (navigation) {
                  return navigation.goBack();
                }
              } catch (e) {
                console.log(e.graphQLErrors);
              }
            }
          })
        })
      )(AuthLogin)
    )
  )
);

const AuthProfile = withCookies(({ cookies }) => {
  return checkAuth(cookies, '') ? (
    <NavLink to="/profile" className="nav-link" activeClassName="active">
      {profileName(cookies)}
    </NavLink>
  ) : null;
});

AuthProfile.propTypes = {
  cookies: PropTypes.instanceOf(Cookies)
};

const AuthRoute = withCookies(({ component: Component, cookies, role, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => (checkAuth(cookies, role) ? <Component {...props} /> : <Redirect to={{ pathname: '/login' }} />)}
    />
  );
});

AuthRoute.propTypes = {
  component: PropTypes.func,
  cookies: PropTypes.instanceOf(Cookies)
};

export { AuthNav };
export { AuthProfile };
export { AuthLoginWithApollo as AuthLogin };
export { AuthRoute };
