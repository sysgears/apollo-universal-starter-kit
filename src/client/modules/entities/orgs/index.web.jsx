/* eslint-disable no-unused-vars */
import React from 'react';
import { Route } from 'react-router-dom';

import Orgs from './containers/Orgs';
import reducers from './reducers';

import { AuthRoute, AuthLoggedInRoute } from '../../../modules/auth/containers/Auth';

import Feature from '../../connector';

export default new Feature({
  route: [
    <AuthRoute
      exact
      path="/orgs"
      scope={['entities:view:all', 'org:view:all', 'entities.orgs:view.all']}
      component={Orgs}
    />
  ],
  reducer: { orgs: reducers }
});
