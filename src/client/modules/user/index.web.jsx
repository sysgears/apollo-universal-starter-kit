// React
import React from 'react';
import { Route, Link } from 'react-router-dom';

// Component and helpers
import Profile from './containers/profile';
import Users from './containers/users';
import Register from './containers/register';
import Login from './containers/login';
import reducers from './reducers';

import { AuthRoute, AuthNav, AuthLogin, AuthProfile } from './containers/auth';

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
    <AuthNav role="admin">
      <Link to="/users" className="nav-link">Users</Link>
    </AuthNav>
  ],
  navItemRight: [
    <AuthProfile />,
    <AuthLogin>
      <span className="nav-link"><Link to="/login" >Login</Link> / <Link to="/register" >Register</Link></span>
    </AuthLogin>
  ],
  reducer: { user: reducers },
  middleware: tokenMiddleware,
  afterware: tokenAfterware,
  connectionParam: connectionParam
});
