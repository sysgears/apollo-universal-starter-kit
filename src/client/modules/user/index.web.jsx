// React
import React from 'react';
import { Route, Link } from 'react-router-dom';

// Component and helpers
import User from './containers/user';
import Users from './containers/users';
import Register from './containers/register';
import Login from './containers/login';
import reducers from './reducers';

import { AuthRoute, AuthNav, AuthLogin } from '../../app/auth';

import Feature from '../connector';

export default new Feature({
  route: [
    <AuthRoute exact path="/profile" role="user" component={User} />,
    <AuthRoute exact path="/users" role="admin" component={Users} />,
    <Route exact path="/register" component={Register} />,
    <Route exact path="/login" component={Login} />
  ],
  navItem: [
    <AuthNav role="user">
      <Link to="/profile" className="nav-link">Profile</Link>
    </AuthNav>,
    <AuthNav role="admin">
      <Link to="/users" className="nav-link">Users</Link>
    </AuthNav>
  ],
  navItemRight:
    <AuthLogin>
      <Link to="/login" className="nav-link">Login</Link>
    </AuthLogin>,
  reducer: { user: reducers }
});
