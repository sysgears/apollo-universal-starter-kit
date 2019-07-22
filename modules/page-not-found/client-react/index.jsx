import React from 'react';
import { Route } from 'react-router-dom';
import ClientModule from '@gqlapp/module-client-react';
import loadable from '@loadable/component';

import resources from './locales';

export default new ClientModule({
  route: [<Route component={loadable(() => import('./containers/PageNotFound').then(c => c.default))} />],
  localization: [{ ns: 'notFound', resources }]
});
