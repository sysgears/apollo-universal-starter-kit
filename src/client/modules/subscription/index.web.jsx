// React
import React from 'react';
import { Route, NavLink } from 'react-router-dom';

// Web UI
import { NavItem } from 'reactstrap';

// Component and helpers
import Subscription from './containers/Subscription';
import SubscribersOnly from './containers/SubscribersOnly';
import { SubscriberNav, SubscriberRoute } from './containers/Auth';
import reducers from './reducers';

import Feature from '../connector';

export default new Feature({
  route: [
    <Route exact path="/subscription" component={Subscription} />,
    <SubscriberRoute exact path="/subscribers-only" component={SubscribersOnly} />
  ],
  navItem: [
    <NavItem>
      <NavLink to="/subscription" className="nav-link" activeClassName="active">
        Subscription
      </NavLink>
    </NavItem>,
    <SubscriberNav>
      <NavItem>
        <NavLink to="/subscribers-only" className="nav-link" activeClassName="active">
          Subscribers Only
        </NavLink>
      </NavItem>
    </SubscriberNav>
  ],
  reducer: { subscription: reducers }
});
