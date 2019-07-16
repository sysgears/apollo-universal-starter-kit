import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

import { withLoadedUser } from './AuthBase';

const AuthRoute = withLoadedUser(
  ({ currentUser, role, redirect = '/login', redirectOnLoggedIn, component: Component, ...rest }) => {
    const RenderComponent = props => {
      // redirect logged in users
      if (redirectOnLoggedIn) {
        return currentUser ? <Redirect to={{ pathname: redirect }} /> : <Component {...props} {...rest} />;
      }

      // redirect users unlogged or without sufficient permissions
      return isRoleMatch(role, currentUser) ? (
        <Component currentUser={currentUser} {...props} {...rest} />
      ) : (
        <Redirect to={{ pathname: redirect }} />
      );
    };

    return <Route {...rest} render={RenderComponent} />;
  }
);

AuthRoute.propTypes = {
  role: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
  redirect: PropTypes.string,
  redirectOnLoggedIn: PropTypes.bool
};

const isRoleMatch = (role, currentUser) => {
  if (!currentUser) {
    return false;
  }
  if (!role) {
    return true;
  }
  return (Array.isArray(role) ? role : [role]).includes(currentUser.role);
};

export * from './AuthBase';
export { AuthRoute };
