import React from 'react';
import { Switch } from 'react-router-dom';

import modules from '../modules';

export default (
  <div>
    <Switch>
      {modules.routes}
    </Switch>
  </div>
);
