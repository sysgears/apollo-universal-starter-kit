/* eslint-disable no-unused-vars */
import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '../../../modules/common/components/web';

import ServiceAccounts from './containers/ServiceAccounts';
import reducers from './reducers';

import { AuthRoute, AuthLoggedInRoute, AuthNav, AuthLogin, AuthProfile } from '../../../modules/user/containers/Auth';

import Feature from '../../connector';

export default new Feature({
  route: [
    <AuthRoute
      exact
      path="/entities/serviceaccounts"
      scope={['entities:view:all', 'entities.serviceaccounts:view.all']}
      component={ServiceAccounts}
    />
  ],
  navItem: (
    <MenuItem key="entities-serviceaccounts">
      <AuthNav scopes={['entities:view:all']}>
        <NavLink to="/entities/serviceaccounts" className="nav-link" activeClassName="active">
          ServiceAccounts
        </NavLink>
      </AuthNav>
    </MenuItem>
  ),
  reducer: { serviceaccounts: reducers }
});
