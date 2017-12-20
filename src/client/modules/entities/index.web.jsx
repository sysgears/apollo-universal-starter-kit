/* eslint-disable no-unused-vars */
import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '../../modules/common/components/web';

import Entities from './containers/Entities';
import EntitiesMenuItem from './components/EntitiesMenuItem';
import reducers from './reducers';

import orgs from './orgs';
import groups from './groups';
import users from './users';
import serviceaccounts from './serviceaccounts';

import { AuthRoute, AuthLoggedInRoute, AuthNav, AuthLogin, AuthProfile } from '../../modules/auth/containers/Auth';

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

let entitiesScopes = [
  'entities/all/view',
  'org/all/view',
  'org/member/view',
  'group/all/view',
  'group/member/view',
  'user/all/view'
];

export default new Feature(
  {
    route: [<AuthRoute exact path="/entities" scopes={entitiesScopes} component={Entities} />],
    navItem: (
      <MenuItem key="entities">
        <AuthNav scopes={entitiesScopes}>
          <EntitiesMenuItem />
        </AuthNav>
      </MenuItem>
    ),
    reducer: { entities: reducers }
  },
  ...subfeatures
);
