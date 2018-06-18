import React from 'react';
import { NavLink } from 'react-router-dom';
import { MenuItem } from '../../modules/common/components/web';
import SubCategory from './components/SubCategory';
import SubCategoryEdit from './containers/SubCategoryEdit';
import resolvers from './resolvers';

import { AuthRoute, IfLoggedIn } from '../user/containers/Auth';
import Feature from '../connector';

export default new Feature({
  route: [
    <AuthRoute
      exact
      path="/subCategory"
      component={SubCategory}
      role={['editor', 'admin']}
      title="Sub Category"
      link="subCategory"
    />,
    <AuthRoute
      exact
      path="/subCategory/:id"
      component={SubCategoryEdit}
      role={['editor', 'admin']}
      title="Sub Category"
      link="subCategory"
    />
  ],
  navItem: (
    <IfLoggedIn role={['editor', 'admin']}>
      <MenuItem key="/subCategory">
        <NavLink to="/subCategory" className="nav-link" activeClassName="active">
          Sub Category
        </NavLink>
      </MenuItem>
    </IfLoggedIn>
  ),
  resolver: resolvers
});
