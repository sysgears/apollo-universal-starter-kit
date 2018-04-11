import React from 'react';
import { Route } from 'react-router-dom';

import PageNotFound from './containers/PageNotFound';
import Feature from '../connector';
import resources from './locales';

export default new Feature({
  route: <Route component={PageNotFound} />,
  localization: { ns: 'notFound', resources }
});
