import React from 'react';
import { Switch } from 'react-router-dom';

import modules from '..';

import Feature from '../connector';

const routerFactory = () => <Switch>{modules.routes}</Switch>;

export default new Feature({
  routerFactory
});
