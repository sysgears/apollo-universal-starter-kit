// React
import React from 'react';
import { Route, NavLink } from 'react-router-dom';

// Web UI
import { NavItem } from 'reactstrap';

// Component and helpers
import Subscription from './containers/Subscription';
import reducers from './reducers';

import Feature from '../connector';

export default new Feature({
  route: <Route exact path="/subscription" component={Subscription} />,
  navItem: (
    <NavItem>
      <NavLink to="/subscription" className="nav-link" activeClassName="active">
        Subscription
      </NavLink>
    </NavItem>
  ),
  reducer: { subscription: reducers }
});
