import React from 'react';
import { Route } from 'react-router-dom';

import PageNotFound from './containers/PageNotFound';
import ClientModule from '../ClientModule';
import resources from './locales';

export default new ClientModule({
  route: [<Route component={PageNotFound} />],
  localization: [{ ns: 'notFound', resources }]
});
