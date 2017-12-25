/* eslint-disable no-unused-vars */
import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '../../../modules/common/components/web';

import Users from './containers/Users';
import UserView from './containers/UserView';
import UserEdit from './containers/UserEdit';
import reducers from './reducers';

import { AuthRoute, AuthLoggedInRoute, AuthNav, AuthLogin, AuthProfile } from '../../../modules/auth/containers/Auth';

import Feature from '../../connector';

const listScopes = ['entities/all/list', 'user/all/list'];
const addScopes = ['entities/all/create', 'user/all/create'];
const viewScopes = ['entities/all/view', 'user/all/view', 'user/self/view'];
const editScopes = ['entities/all/update', 'user/all/update', 'user/self/update'];

export default new Feature({
  route: [
    <AuthRoute exact path="/users" scope={listScopes} component={Users} />,
    <AuthRoute exact path="/users/add" scope={addScopes} component={UserEdit} />,
    <AuthRoute exact path="/users/:id" scopes={viewScopes} component={UserView} />,
    <AuthRoute exact path="/users/:id/edit" scopes={editScopes} component={UserEdit} />
  ],
  reducer: { users: reducers }
});
