/* eslint-disable no-unused-vars */
import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '../../modules/common/components/web';

import Entities from './containers/Entities';
import reducers from './reducers';

import orgs from './orgs';
import groups from './groups';
import users from './users';
import serviceaccounts from './serviceaccounts';

import { AuthRoute, AuthLoggedInRoute, AuthNav, AuthLogin, AuthProfile } from '../../modules/user/containers/Auth';

import Feature from '../connector';

import settings from '../../../../settings';

const config = settings.entities;

let subfeatures = [];

if (config.orgs.enabled) {
  subfeatures.push(orgs);
}

if (config.groups.enabled) {
  subfeatures.push(groups);
}

if (config.users.enabled) {
  subfeatures.push(users);
}

if (config.serviceaccounts.enabled) {
  subfeatures.push(serviceaccounts);
}

export default new Feature(
  {
    route: [<AuthRoute exact path="/entities" scopes={['entities:view:all']} component={Entities} />],
    navItem: (
      <MenuItem key="entities">
        <AuthNav scopes={['entities:view:all']}>
          <NavLink to="/entities" className="nav-link" activeClassName="active">
            Entities
          </NavLink>
        </AuthNav>
      </MenuItem>
    ),
    reducer: { entities: reducers }
  },
  ...subfeatures
);
