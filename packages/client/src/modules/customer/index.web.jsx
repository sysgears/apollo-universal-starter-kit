import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '../../modules/common/components/web';
import Customer from './components/Customer';
import CustomerEdit from './containers/CustomerEdit';
import reducers from './reducers';

import Feature from '../connector';

export default new Feature({
  route: [
    <Route exact path="/customer" component={Customer} />,
    <Route exact path="/customer/:id" component={CustomerEdit} />
  ],
  navItem: (
    <MenuItem key="/customer">
      <NavLink to="/customer" className="nav-link" activeClassName="active">
        Customer
      </NavLink>
    </MenuItem>
  ),
  reducer: { customer: reducers }
});
