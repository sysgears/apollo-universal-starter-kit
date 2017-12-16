/* eslint-disable no-unused-vars */
import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '../../../modules/common/components/web';

import Groups from './containers/Groups';
import reducers from './reducers';

import { AuthRoute, AuthLoggedInRoute, AuthNav, AuthLogin, AuthProfile } from '../../../modules/user/containers/Auth';

import Feature from '../../connector';

export default new Feature({
  route: [
    <AuthRoute
      exact
      path="/entities/groups"
      scope={['entities:view:all', 'entities.groups:view.all']}
      component={Groups}
    />
  ],
  navItem: (
    <MenuItem key="entities-groups">
      <AuthNav scopes={['entities:view:all']}>
        <NavLink to="/entities/groups" className="nav-link" activeClassName="active">
          Groups
        </NavLink>
      </AuthNav>
    </MenuItem>
  ),
  reducer: { groups: reducers }
});
