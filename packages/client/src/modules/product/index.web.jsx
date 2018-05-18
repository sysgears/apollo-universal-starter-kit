import React from 'react';
import { NavLink } from 'react-router-dom';
import { MenuItem } from '../../modules/common/components/web';
import Product from './components/Product';
import ProductEdit from './containers/ProductEdit';
import resolvers from './resolvers';

import { AuthRoute, IfLoggedIn } from '../user/containers/Auth';
import Feature from '../connector';

export default new Feature({
  route: [
    <AuthRoute exact path="/product" component={Product} role={['editor', 'admin']} title="Product" link="product" />,
    <AuthRoute
      exact
      path="/product/:id"
      component={ProductEdit}
      role={['editor', 'admin']}
      title="Product"
      link="product"
    />
  ],
  navItem: (
    <IfLoggedIn role={['editor', 'admin']}>
      <MenuItem key="/product">
        <NavLink to="/product" className="nav-link" activeClassName="active">
          Product
        </NavLink>
      </MenuItem>
    </IfLoggedIn>
  ),
  resolver: resolvers
});
