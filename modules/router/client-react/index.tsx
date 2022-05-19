import React from 'react';
import { Router, Switch } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import ClientModule from '@gqlapp/module-client-react';

const ref: { modules: ClientModule } = { modules: null };

const MainRouter = () => {
  const history = createMemoryHistory();
  return (
    <Router history={history}>
      <Switch>{ref.modules.routes}</Switch>
    </Router>
  );
};

export default new ClientModule({
  router: <MainRouter />,
  onAppCreate: [async (modules: ClientModule) => (ref.modules = modules)],
});
