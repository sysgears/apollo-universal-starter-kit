import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, NavLink } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import decode from 'jwt-decode';

import { IfLoggedIn, IfNotLoggedIn } from './AuthBase.web';

const checkAuth = (cookies, scope) => {
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
    const { user: { username, fullName } } = decode(token);
    return fullName ? fullName : username;
  } catch (e) {
    return '';
  }
};

const AuthNav = withCookies(({ children, cookies, scope }) => {
  return checkAuth(cookies, scope) ? children : null;
});

AuthNav.propTypes = {
  children: PropTypes.object,
  cookies: PropTypes.instanceOf(Cookies)
};

const AuthLogin = ({ children, cookies, logout }) => {
  return checkAuth(cookies) ? (
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
      {label}
    </NavLink>
  ) : null;
});

AuthLoggedIn.propTypes = {
  component: PropTypes.func,
  cookies: PropTypes.instanceOf(Cookies),
  label: PropTypes.string,
  to: PropTypes.string
};

const AuthLoggedInRoute = withCookies(({ component: Component, cookies, redirect, scope, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        checkAuth(cookies, scope) ? <Redirect to={{ pathname: redirect }} /> : <Component {...props} />
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

const AuthRoute = ({ role, redirect, redirectOnLoggedIn, ...props }) =>
  redirectOnLoggedIn ? (
    <IfNotLoggedIn role={role} elseComponent={<Redirect to={{ pathname: redirect }} />}>
      <Route {...props} />
    </IfNotLoggedIn>
  ) : (
    <IfLoggedIn role={role} elseComponent={<Redirect to={{ pathname: redirect }} />}>
      <Route {...props} />
    </IfLoggedIn>
  );

AuthRoute.propTypes = {
  role: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
  redirect: PropTypes.string.isRequired,
  redirectOnLoggedIn: PropTypes.bool
};

export * from './AuthBase.web';
export { AuthRoute };
export { AuthNav };
export { AuthProfile };
export { AuthLoggedInRoute };
