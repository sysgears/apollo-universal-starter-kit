import React from 'react';
import { Switch } from 'react-router-dom';

import App from './app';
import modules from '../../common/modules';

export default (
  <App>
    <Switch>
      {modules.routes}
    </Switch>
  </App>
);
