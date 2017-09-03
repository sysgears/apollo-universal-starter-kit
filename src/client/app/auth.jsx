import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import { NavItem } from 'reactstrap';
import decode from 'jwt-decode';

const checkAuth = (cookies) => {
  let token = cookies.get('x-token');
  let refreshToken = cookies.get('x-refresh-token');

  if (__CLIENT__) {
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

  } catch (e) {
    return false;
  }

  return true;
};

export const AuthNav = withCookies(({ children, cookies }) => {
  return checkAuth(cookies) ? <NavItem>{children}</NavItem> : null;
});

AuthNav.propTypes = {
  children: PropTypes.object,
  cookies: PropTypes.instanceOf(Cookies)
};

export const AuthRoute = withCookies(({ component: Component, cookies, ...rest }) => {
  return (
    <Route {...rest} render={props => (
      checkAuth(cookies) ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: '/login' }} />
      )
    )} />
  );
});

AuthRoute.propTypes = {
  component: PropTypes.func,
  cookies: PropTypes.instanceOf(Cookies)
};
