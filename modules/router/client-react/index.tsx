import React from 'react';
import { Switch } from 'react-router-dom';
import ClientModule from '@module/module-client-react';

const ref: { modules: ClientModule } = { modules: null };

const Router = () => <Switch>{ref.modules.routes}</Switch>;

export default new ClientModule({
  router: <Router />,
  onAppCreate: [(modules: ClientModule) => (ref.modules = modules)]
});
