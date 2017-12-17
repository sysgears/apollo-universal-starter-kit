/* eslint-disable no-unused-vars */
import React from 'react';
import { Route } from 'react-router-dom';

import Feature from '../../connector';
import { AuthRoute, AuthLoggedInRoute } from '../../../modules/auth/containers/Auth';

import Groups from './containers/Groups';
import GroupEdit from './containers/GroupEdit';

import MyGroups from './containers/MyGroups';

import reducers from './reducers';

const memberListScopes = ['entities/all/list', 'group/all/list', 'group/member/list'];
const memberViewScopes = ['entities/all/view', 'group/all/view', 'group/member/view'];

const groupListScopes = ['entities/all/list', 'group/all/list'];
const groupViewScopes = ['entities/all/view', 'group/all/view'];

export default new Feature({
  route: [
    <AuthRoute exact path="/entities/groups" scope={groupListScopes} component={Groups} />,
    <AuthRoute exact path="/entities/groups/:id" scopes={groupViewScopes} component={GroupEdit} />,
    <AuthRoute exact path="/groups" scope={memberListScopes} component={MyGroups} />,
    <AuthRoute exact path="/groups/:id" scopes={memberViewScopes} component={GroupEdit} />
  ],
  reducer: { groups: reducers }
});
