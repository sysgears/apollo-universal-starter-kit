// React
import React from 'react';
import { Route, Link } from 'react-router-dom';

// Web UI
import { NavItem } from 'reactstrap';

// Component and helpers
import User from './containers/user';
import Users from './containers/users';
import Register from './containers/register';
import Login from './containers/login';
import reducers from './reducers';

import Feature from '../connector';

export default new Feature({
  route: [
    <Route exact path="/user" component={User} />,
    <Route exact path="/users" component={Users} />,
    <Route exact path="/register" component={Register} />,
    <Route exact path="/login" component={Login} />
  ],
  navItem: [
      <NavItem>
        <Link to="/user" className="nav-link">User</Link>
      </NavItem>,
      <NavItem>
        <Link to="/users" className="nav-link">Users</Link>
      </NavItem>,
      <NavItem>
        <Link to="/register" className="nav-link">Register</Link>
      </NavItem>,
      <NavItem>
        <Link to="/login" className="nav-link">Login</Link>
      </NavItem>,
    ],
  reducer: { user: reducers }
});
