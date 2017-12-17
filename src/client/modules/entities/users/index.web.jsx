/* eslint-disable no-unused-vars */
import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '../../../modules/common/components/web';

import Users from './containers/Users';
import UserEdit from './containers/UserEdit';
import reducers from './reducers';

import { AuthRoute, AuthLoggedInRoute, AuthNav, AuthLogin, AuthProfile } from '../../../modules/auth/containers/Auth';

import Feature from '../../connector';

const usersScopes = ['entities/all/list', 'user/all/list'];

const userScopes = ['entities/all/view', 'user/all/view'];

export default new Feature({
  route: [
    <AuthRoute exact path="/users" scope={usersScopes} component={Users} />,
    <AuthRoute exact path="/users/:id" scopes={userScopes} component={UserEdit} />
  ],
  reducer: { users: reducers }
});
