/* eslint-disable no-unused-vars */
import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '../../../modules/common/components/web';

import Users from './containers/Users';
import UserView from './containers/UserView';
import UserEdit from './containers/UserEdit';
import UserProfilePublic from './containers/UserProfilePublic';
import UserProfilePrivate from './containers/UserProfilePrivate';

import reducers from './reducers';

import {
  AuthRoute,
  AuthMultiRoute,
  AuthLoggedInRoute,
  AuthNav,
  AuthLogin,
  AuthProfile
} from '../../../modules/auth/containers/Auth';

import Feature from '../../connector';

const listScopes = ['entities/all/list', 'user/all/list'];
const addScopes = ['entities/all/create', 'user/all/create'];
const viewScopes = ['entities/all/view', 'user/all/view', 'user/self/view'];
const editScopes = ['entities/all/update', 'user/all/update', 'user/self/update'];

const profileScopesMap = [
  {
    scopes: ['user/self/view'],
    component: UserProfilePrivate
  },
  {
    scopes: [],
    component: UserProfilePublic
  }
];

export default new Feature({
  route: [
    <AuthMultiRoute exact path="/profile/:id" scopeComponentMap={profileScopesMap} />,

    <AuthRoute exact path="/users" scopes={listScopes} component={Users} />,
    <AuthRoute exact path="/users/add" scopes={addScopes} component={UserEdit} />,
    <AuthRoute exact path="/users/:id" scopes={viewScopes} component={UserView} />,
    <AuthRoute exact path="/users/:id/edit" scopes={editScopes} component={UserEdit} />
  ],
  reducer: { users: reducers }
});
