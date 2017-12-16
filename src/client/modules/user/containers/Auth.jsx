import React from 'react';
import PropTypes from 'prop-types';
import { withApollo, graphql, compose } from 'react-apollo';
import { Route, Redirect, NavLink, withRouter } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import decode from 'jwt-decode';

import log from '../../../../common/log';
import CURRENT_USER_QUERY from '../graphql/CurrentUserQuery.graphql';
import LOGOUT from '../graphql/Logout.graphql';

import settings from '../../../../../settings';

const authz = settings.auth.authorization;

/*
 * taken from 'graphql-auth' so that the front and back ends can use the same authorization semantics
 * https://github.com/kkemple/graphql-auth/blob/3c72d5939413d161c60cafaccd2d79d56704aba9/index.js#L17
 */
function validateScope(required, provided) {
  console.log('validateScope', required, provided);
  let hasScope = false;

  required.forEach(scope => {
    provided.forEach(function(perm) {
      // user:* -> user:create, user:view:self
      var permRe = new RegExp('^' + perm.replace('*', '.*') + '$');
      if (permRe.exec(scope)) hasScope = true;
    });
  });

  return hasScope;
}

const checkAuth = (cookies, requiredScopes) => {
  console.log('checkAuth', requiredScopes);

  // first check token
  let token = null;
  let refreshToken = null;

  // one or both of these is returning the string 'undefined' when there are no tokens... >:[
  if (cookies && cookies.get('r-token')) {
    token = cookies.get('r-token');
    refreshToken = cookies.get('r-refresh-token');
  }
  if (__CLIENT__ && window.localStorage.getItem('token')) {
    token = window.localStorage.getItem('token');
    refreshToken = window.localStorage.getItem('refreshToken');
  }

  // If we have no token, return false
  if (
    !token ||
    !refreshToken ||
    token === undefined ||
    refreshToken === undefined ||
    token === 'undefined' ||
    refreshToken === 'undefined'
  ) {
    return false;
  }

  // If there are no scopes, ALLOW
  if (!requiredScopes || requiredScopes.length === 0) {
    return true;
  }

  // Otherwise, decode token, grab scopes, and compare to required
  try {
    const { exp } = decode(refreshToken);

    if (exp < new Date().getTime() / 1000) {
      return false;
    }
    const { user: { id, email, role } } = decode(token);

    console.log('decoded:', role, email, id);

    let userScopes = null;

    if (authz.method === 'basic') {
      userScopes = authz.basic.scopes[role];
    } else if (authz.method === 'rbac') {
      // TODO
    }

    const yesTheyCan = validateScope(requiredScopes, userScopes);

    console.log('Can they? ', yesTheyCan ? 'yes' : 'no');

    return yesTheyCan;
  } catch (e) {
    console.log(e);
    return false;
  }
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
    const { user: { email } } = decode(token);
    return email;
  } catch (e) {
    return '';
  }
};

const AuthNav = withCookies(({ children, cookies, scopes }) => {
  return checkAuth(cookies, scopes) ? children : null;
});

AuthNav.propTypes = {
  children: PropTypes.object,
  cookies: PropTypes.instanceOf(Cookies)
};

const AuthLogin = ({ children, cookies, logout }) => {
  let can = checkAuth(cookies);
  console.log('AuthLogin', can);
  return can ? (
    <a href="#" onClick={() => logout()} className="nav-link">
      Logout
    </a>
  ) : (
    children
  );
};

AuthLogin.propTypes = {
  children: PropTypes.object,
  cookies: PropTypes.instanceOf(Cookies),
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
                log.error(e.stack);
              }
            }
          })
        })
      )(AuthLogin)
    )
  )
);

const AuthProfile = withCookies(({ cookies }) => {
  return checkAuth(cookies) ? (
    <NavLink to="/profile" className="nav-link" activeClassName="active">
      {profileName(cookies)}
    </NavLink>
  ) : null;
});

AuthProfile.propTypes = {
  cookies: PropTypes.instanceOf(Cookies)
};

const AuthLoggedIn = withCookies(({ cookies, label, to, ...rest }) => {
  return checkAuth(cookies) ? (
    <NavLink to={to} {...rest}>
      {label}?
    </NavLink>
  ) : null;
});

AuthLoggedIn.propTypes = {
  component: PropTypes.func,
  cookies: PropTypes.instanceOf(Cookies),
  label: PropTypes.string,
  to: PropTypes.string
};

const AuthRoute = withCookies(({ component: Component, cookies, scopes, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        checkAuth(cookies, scopes) ? <Component {...props} /> : <Redirect to={{ pathname: '/login' }} />
      }
    />
  );
});

AuthRoute.propTypes = {
  component: PropTypes.func,
  cookies: PropTypes.instanceOf(Cookies)
};

const AuthLoggedInRoute = withCookies(({ component: Component, cookies, redirect, scopes, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        checkAuth(cookies, scopes) ? <Redirect to={{ pathname: redirect }} /> : <Component {...props} />
      }
    />
  );
});

AuthLoggedInRoute.propTypes = {
  component: PropTypes.func,
  cookies: PropTypes.instanceOf(Cookies),
  redirect: PropTypes.string,
  scope: PropTypes.string
};

export { AuthNav };
export { AuthLoggedIn };
export { AuthLoginWithApollo as AuthLogin };
export { AuthProfile };
export { AuthRoute };
export { AuthLoggedInRoute };
