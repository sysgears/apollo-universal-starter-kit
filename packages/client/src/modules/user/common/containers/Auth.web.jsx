import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

import { IfLoggedIn, IfNotLoggedIn } from './AuthBase';

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

export * from './AuthBase';
export { AuthRoute };
