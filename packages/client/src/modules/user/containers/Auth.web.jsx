import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

import { withLoadedUser } from './AuthBase';

const AuthRoute = withLoadedUser(({ currentUser, role, redirect, redirectOnLoggedIn, component, ...props }) => (
  <Route
    {...props}
    render={() =>
      (currentUser && redirectOnLoggedIn) || (!currentUser && !redirectOnLoggedIn) ? (
        <Redirect to={{ pathname: redirect }} />
      ) : (
        React.createElement(component)
      )
    }
  />
));

AuthRoute.propTypes = {
  role: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
  redirect: PropTypes.string.isRequired,
  redirectOnLoggedIn: PropTypes.bool
};

export * from './AuthBase';
export { AuthRoute };
