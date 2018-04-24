import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

import { withLoadedUser } from './AuthBase';

const AuthRoute = withLoadedUser(
  ({
    currentUser,
    role,
    redirect = '/login',
    redirectOnIdMatch,
    redirectOnLoggedIn,
    computedMatch: { params: { id } },
    component: Component,
    ...rest
  }) => {
    const preparedRole = Array.isArray(role) ? role : [role];
    const isRoleAccess = currentUser && currentUser.role && preparedRole.includes(currentUser.role);
    const isUserAccess = (currentUser && (currentUser.id === Number(id) || currentUser.role === 'admin')) || false;
    return (
      <Route
        {...rest}
        render={props =>
          (!!redirectOnIdMatch && !isUserAccess) ||
          (role && !isRoleAccess) ||
          (currentUser && redirectOnLoggedIn) ||
          (!currentUser && !redirectOnLoggedIn) ? (
            <Redirect to={{ pathname: redirect }} />
          ) : (
            <Component currentUser={currentUser} {...props} {...rest} />
          )
        }
      />
    );
  }
);

AuthRoute.propTypes = {
  role: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
  redirect: PropTypes.string,
  redirectOnLoggedIn: PropTypes.bool
};

export * from './AuthBase';
export { AuthRoute };
