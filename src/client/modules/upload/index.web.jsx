// React
import React from 'react';
import { Route, NavLink } from 'react-router-dom';

// Web UI
import { NavItem } from 'reactstrap';

// Component and helpers
import Upload from './containers/Upload';
import reducers from './reducers';

import Feature from '../connector';

export default new Feature({
  route: <Route exact path="/upload" component={Upload} />,
  navItem: (
    <NavItem>
      <NavLink to="/upload" className="nav-link" activeClassName="active">
        Upload
      </NavLink>
    </NavItem>
  ),
  reducer: { upload: reducers }
});
