import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

import { withLoadedUser } from './AuthBase';

const AuthRoute = withLoadedUser(
  ({ currentUser, role, redirect = '/login', redirectOnLoggedIn, component: Component, ...rest }) => (
    <Route
      {...rest}
      render={props =>
        (currentUser && redirectOnLoggedIn) || (!currentUser && !redirectOnLoggedIn) ? (
          <Redirect to={{ pathname: redirect }} />
        ) : (
          <Component currentUser={currentUser} {...props} {...rest} />
        )
      }
    />
  )
);

AuthRoute.propTypes = {
  role: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
  redirect: PropTypes.string,
  redirectOnLoggedIn: PropTypes.bool
};

export * from './AuthBase';
export { AuthRoute };
