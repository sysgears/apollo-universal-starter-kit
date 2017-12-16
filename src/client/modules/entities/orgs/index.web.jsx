/* eslint-disable no-unused-vars */
import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '../../../modules/common/components/web';

import Orgs from './containers/Orgs';
import reducers from './reducers';

import { AuthRoute, AuthLoggedInRoute, AuthNav, AuthLogin, AuthProfile } from '../../../modules/user/containers/Auth';

import Feature from '../../connector';

export default new Feature({
  route: [
    <AuthRoute exact path="/entities/orgs" scope={['entities:view:all', 'entities.orgs:view.all']} component={Orgs} />
  ],
  navItem: (
    <MenuItem key="entities-orgs">
      <AuthNav scopes={['entities:view:all']}>
        <NavLink to="/entities/orgs" className="nav-link" activeClassName="active">
          Orgs
        </NavLink>
      </AuthNav>
    </MenuItem>
  ),
  reducer: { orgs: reducers }
});
