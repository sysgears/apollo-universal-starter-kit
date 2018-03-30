import React from 'react';
import { NavLink } from 'react-router-dom';
import { MenuItem } from '../../modules/common/components/web';
import $Module$ from './components/$Module$';
import $Module$Edit from './containers/$Module$Edit';
import resolvers from './resolvers';

import { AuthRoute, IfLoggedIn } from '../user/containers/Auth';
import Feature from '../connector';

export default new Feature({
  route: [
    <AuthRoute
      exact
      path="/$module$"
      component={$Module$}
      role={['editor', 'admin']}
      title="$MoDuLe$"
      link="$module$"
    />,
    <AuthRoute
      exact
      path="/$module$/:id"
      component={$Module$Edit}
      role={['editor', 'admin']}
      title="$MoDuLe$"
      link="$module$"
    />
  ],
  navItem: (
    <IfLoggedIn role={['editor', 'admin']}>
      <MenuItem key="/$module$">
        <NavLink to="/$module$" className="nav-link" activeClassName="active">
          $MoDuLe$
        </NavLink>
      </MenuItem>
    </IfLoggedIn>
  ),
  resolver: resolvers
});
