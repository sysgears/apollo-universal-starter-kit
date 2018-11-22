import React from 'react';
import { Switch } from 'react-router-dom';

import modules from '..';

import ClientModule from '../ClientModule';

const routerFactory = () => <Switch>{modules.routes}</Switch>;

export default new ClientModule({
  routerFactory
});
