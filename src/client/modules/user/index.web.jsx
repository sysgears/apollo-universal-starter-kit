// React
import React from 'react';
import { Route, Link } from 'react-router-dom';

// Web UI
import { NavItem } from 'reactstrap';

// Component and helpers
import User from './containers/user';
import reducers from './reducers';

import Feature from '../connector';

export default new Feature({
  route: <Route exact path="/user" component={User}/>,
  navItem:
    <NavItem>
      <Link to="/user" className="nav-link">User</Link>
    </NavItem>,
  reducer: { user: reducers }
});
