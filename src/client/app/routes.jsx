import React from 'react';
import { Switch } from 'react-router-dom';

import App from './app';
import { routes } from '../modules';

export default (
  <App>
    <Switch>
      {routes}
    </Switch>
  </App>
);
