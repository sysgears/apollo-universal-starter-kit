import React from 'react';
import ClientModule from '@gqlapp/module-client-react';
import { NavLink } from 'react-router-dom';
import { MenuItem } from '@gqlapp/look-client-react';
import { AuthRoute, IfLoggedIn } from '@gqlapp/user-client-react';

import $Module$ from './components/$Module$';
import $Module$Edit from './containers/$Module$Edit';
import resolvers from './resolvers';

export default new ClientModule({
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
  navItem: [
    <IfLoggedIn role={['editor', 'admin']}>
      <MenuItem key="/$module$">
        <NavLink to="/$module$" className="nav-link" activeClassName="active">
          $MoDuLe$
        </NavLink>
      </MenuItem>
    </IfLoggedIn>
  ],
  resolver: [resolvers]
});
