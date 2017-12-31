/* eslint-disable no-unused-vars */
import React from 'react';
import { Route } from 'react-router-dom';

import Feature from '../../connector';
import { AuthRoute } from '../../../modules/auth/containers/Auth';

import Groups from './containers/Groups';
import GroupMain from './containers/GroupMain';
import GroupEdit from './containers/GroupEdit';

import reducers from './reducers';
import groupMembersReducers from './reducers/groupMembers';

const groupListScopes = ['entities/all/list', 'group/all/list'];
const groupViewScopes = ['entities/all/view', 'group/all/view'];

const memberListScopes = ['entities/all/list', 'group/all/list', 'group/member/list'];
const memberViewScopes = ['entities/all/view', 'group/all/view', 'group/member/view'];

export default new Feature({
  route: [
    // <AuthRoute exact path="/groups" scope={memberListScopes} component={Groups} />,
    // <AuthRoute exact path="/groups/:id" scopes={memberViewScopes} component={GroupView} />
    <AuthRoute exact path="/groups" scope={null} component={Groups} />,
    <AuthRoute exact path="/groups/:groupId" scopes={null} component={GroupMain} />
  ],
  reducer: { groups: reducers, groupMembers: groupMembersReducers }
});
