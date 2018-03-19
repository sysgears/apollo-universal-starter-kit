import React from 'react';
import { Route, NavLink } from 'react-router-dom';

import Contact from './containers/Contact';
import Feature from '../connector';
import { MenuItem } from '../../modules/common/components/web';

export default new Feature({
  route: <Route exact path="/contact" component={Contact} />,
  navItem: (
    <MenuItem key="contact">
      <NavLink to="/contact" className="nav-link" activeClassName="active">
        Contact Us
      </NavLink>
    </MenuItem>
  )
});
