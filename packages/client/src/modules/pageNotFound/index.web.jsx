import React from 'react';
import { Route } from 'react-router-dom';

import PageNotFound from './containers/PageNotFound';
import Feature from '../connector';

export default new Feature({
  route: <Route component={PageNotFound} />
});
