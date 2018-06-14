import React from 'react';
import { NavLink } from 'react-router-dom';
import { MenuItem } from '../../modules/common/components/web';
import Category from './components/Category';
import CategoryEdit from './containers/CategoryEdit';
import resolvers from './resolvers';

import { AuthRoute, IfLoggedIn } from '../user/containers/Auth';
import Feature from '../connector';

export default new Feature({
  route: [
    <AuthRoute
      exact
      path="/category"
      component={Category}
      role={['editor', 'admin']}
      title="Category"
      link="category"
    />,
    <AuthRoute
      exact
      path="/category/:id"
      component={CategoryEdit}
      role={['editor', 'admin']}
      title="Category"
      link="category"
    />
  ],
  navItem: (
    <IfLoggedIn role={['editor', 'admin']}>
      <MenuItem key="/category">
        <NavLink to="/category" className="nav-link" activeClassName="active">
          Category
        </NavLink>
      </MenuItem>
    </IfLoggedIn>
  ),
  resolver: resolvers
});
