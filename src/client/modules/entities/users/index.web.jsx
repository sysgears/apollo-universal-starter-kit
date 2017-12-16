/* eslint-disable no-unused-vars */
import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '../../../modules/common/components/web';

import Users from './containers/Users';
import reducers from './reducers';

import { AuthRoute, AuthLoggedInRoute, AuthNav, AuthLogin, AuthProfile } from '../../../modules/user/containers/Auth';

import Feature from '../../connector';

export default new Feature({
  route: [
    <AuthRoute exact path="/entities/users" scope={['entities:view:all', 'entities.user:view.all']} component={Users} />
  ],
  navItem: (
    <MenuItem key="entities-users">
      <AuthNav scopes={['entities:view:all']}>
        <NavLink to="/entities/users" className="nav-link" activeClassName="active">
          Users
        </NavLink>
      </AuthNav>
    </MenuItem>
  ),
  reducer: { users: reducers }
});
