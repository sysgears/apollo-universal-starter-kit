// React
import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { NavItem } from 'reactstrap';

// Component and helpers
import Profile from './containers/Profile';
import Users from './containers/Users';
import Register from './containers/Register';
import Login from './containers/Login';
import reducers from './reducers';

import { AuthRoute, AuthNav, AuthLogin, AuthProfile } from './containers/Auth';

import Feature from '../connector';

function tokenMiddleware(req) {
  req.options.headers['x-token'] = window.localStorage.getItem('token');
  req.options.headers['x-refresh-token'] = window.localStorage.getItem('refreshToken');
}

function tokenAfterware(res) {
  const token = res.options.headers['x-token'];
  const refreshToken = res.options.headers['x-refresh-token'];
  if (token) {
    window.localStorage.setItem('token', token);
  }
  if (refreshToken) {
    window.localStorage.setItem('refreshToken', refreshToken);
  }
}

function connectionParam() {
  return {
    token: window.localStorage.getItem('token'),
    refreshToken: window.localStorage.getItem('refreshToken')
  };
}

export default new Feature({
  route: [
    <AuthRoute exact path="/profile" role="user" component={Profile} />,
    <AuthRoute exact path="/users" role="admin" component={Users} />,
    <Route exact path="/register" component={Register} />,
    <Route exact path="/login" component={Login} />
  ],
  navItem: [
    <NavItem>
      <AuthNav role="admin">
        <NavLink to="/users" className="nav-link" activeClassName="active">
          Users
        </NavLink>
      </AuthNav>
    </NavItem>
  ],
  navItemRight: [
    <NavItem>
      <AuthProfile />
    </NavItem>,
    <NavItem>
      <AuthLogin>
        <span className="nav-link">
          <NavLink to="/login" activeClassName="active">
            Login
          </NavLink>{' '}
          /{' '}
          <NavLink to="/register" activeClassName="active">
            Register
          </NavLink>
        </span>
      </AuthLogin>
    </NavItem>
  ],
  reducer: { user: reducers },
  middleware: tokenMiddleware,
  afterware: tokenAfterware,
  connectionParam: connectionParam
});
