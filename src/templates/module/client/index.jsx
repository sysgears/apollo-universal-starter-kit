import React from 'react';
import { Route, Link } from 'react-router-dom';
import { NavItem } from 'reactstrap';

import [Module] from './containers/[module]';
import reducers from './reducers';

import Feature from '../connector';

export default new Feature({
  route: <Route exact path="/[module]" component={[Module]}/>,
  navItem:
    <NavItem>
      <Link to="/[module]" className="nav-link">[Module]</Link>
    </NavItem>,
  reducer: { [module]: reducers }
});
