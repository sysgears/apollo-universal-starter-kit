import React from 'react';
import { Route } from 'react-router-dom';

import PageNotFound from './containers/PageNotFound.web';
import Feature from '../connector.web';

export default new Feature({
  route: <Route component={PageNotFound} />
});
