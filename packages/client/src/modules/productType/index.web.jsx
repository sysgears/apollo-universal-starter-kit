import React from 'react';
import { NavLink } from 'react-router-dom';
import { MenuItem } from '../../modules/common/components/web';
import ProductType from './components/ProductType';
import ProductTypeEdit from './containers/ProductTypeEdit';
import resolvers from './resolvers';

import { AuthRoute, IfLoggedIn } from '../user/containers/Auth';
import Feature from '../connector';

export default new Feature({
  route: [
    <AuthRoute
      exact
      path="/productType"
      component={ProductType}
      role={['editor', 'admin']}
      title="Product Type"
      link="productType"
    />,
    <AuthRoute
      exact
      path="/productType/:id"
      component={ProductTypeEdit}
      role={['editor', 'admin']}
      title="Product Type"
      link="productType"
    />
  ],
  navItem: (
    <IfLoggedIn role={['editor', 'admin']}>
      <MenuItem key="/productType">
        <NavLink to="/productType" className="nav-link" activeClassName="active">
          Product Type
        </NavLink>
      </MenuItem>
    </IfLoggedIn>
  ),
  resolver: resolvers
});
