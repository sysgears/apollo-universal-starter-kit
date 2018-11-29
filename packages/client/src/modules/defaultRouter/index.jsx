import React from 'react';
import { Switch } from 'react-router-dom';

import ClientModule from '../ClientModule';

const ref = { modules: null };

const routerFactory = () => <Switch>{ref.modules.routes}</Switch>;

export default new ClientModule({
  routerFactory,
  onCreate: [modules => (ref.modules = modules)]
});
