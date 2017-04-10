import React from 'react';
import { Switch } from 'react-router-dom';

import App from './app';
import { modulesRoutes } from '../modules';

export default (
  <App>
    <Switch>
      {modulesRoutes}
    </Switch>
  </App>
);
