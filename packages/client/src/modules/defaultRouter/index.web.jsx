import React from 'react';
import { Switch } from 'react-router-dom';

import modules from '../';
import { PageLayout } from '../common/components/web';
import Feature from '../connector';

const routerFactory = () => (
  <PageLayout>
    <Switch>{modules.routes}</Switch>
  </PageLayout>
);

export default new Feature({
  routerFactory
});
