import React from 'react';
import { Switch } from 'react-router-dom';

import modules from '../index.web';

import Feature from '../connector.web';

const routerFactory = () => <Switch>{modules.routes}</Switch>;

export default new Feature({
  routerFactory
});
