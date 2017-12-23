import React from 'react';
import { Route } from 'react-router-dom';

import PageNotFound from './containers/PageNotFound';
import Plugin from '../plugin';

export default new Plugin({
  route: <Route component={PageNotFound} />
});
