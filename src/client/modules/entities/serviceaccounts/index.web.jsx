/* eslint-disable no-unused-vars */
import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '../../../modules/common/components/web';

import ServiceAccounts from './containers/ServiceAccounts';
import reducers from './reducers';

import { AuthRoute, AuthLoggedInRoute, AuthNav, AuthLogin, AuthProfile } from '../../../modules/auth/containers/Auth';

import Feature from '../../connector';

export default new Feature({
  route: [
    <AuthRoute
      exact
      path="/serviceaccounts"
      scope={['entities:view:all', 'serviceaccount:view:all', 'entities.serviceaccount:view.all']}
      component={ServiceAccounts}
    />
  ],
  reducer: { serviceaccounts: reducers }
});
