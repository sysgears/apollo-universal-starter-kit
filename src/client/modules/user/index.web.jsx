/* eslint-disable no-undef */
// React
import React from 'react';
import PropTypes from 'prop-types';
import { Route, Link, Redirect } from 'react-router-dom';
import decode from 'jwt-decode';

// Web UI
import { NavItem } from 'reactstrap';

// Component and helpers
import User from './containers/user';
import Users from './containers/users';
import Register from './containers/register';
import Login from './containers/login';
import reducers from './reducers';

import Feature from '../connector';

const checkAuth = () => {

  let token = null;
  let refreshToken = null;

  if (__CLIENT__) {
    token = localStorage.getItem('token');
    refreshToken = localStorage.getItem('refreshToken');
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

const AuthRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    checkAuth() ? (
      <Component {...props} />
    ) : (
      <Redirect to={{ pathname: '/login' }} />
    )
  )} />
);

AuthRoute.propTypes = {
  component: PropTypes.func,
};


export default new Feature({
  route: [
    <Route exact path="/user" component={User} />,
    <AuthRoute exact path="/users" component={Users} />,
    <Route exact path="/register" component={Register} />,
    <Route exact path="/login" component={Login} />
  ],
  navItem: [
      <NavItem>
        <Link to="/user" className="nav-link">User</Link>
      </NavItem>,
      <NavItem>
        {checkAuth() ? (
          <Link to="/users" className="nav-link">Users</Link>
        ) : (
          <Link to="/login" className="nav-link">Login</Link>
        )}
      </NavItem>,
      <NavItem>
        <Link to="/register" className="nav-link">Register</Link>
      </NavItem>
    ],
  reducer: { user: reducers }
});
