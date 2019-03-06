import React from 'react';
import { Route } from 'react-router-dom';

import Counter from './containers/Counter';
import counters from './counters';
import ClientModule from '@gqlapp/module-client-react';
import resources from './locales';

export default new ClientModule(counters, {
  route: [<Route exact path="/" component={Counter} />],
  localization: [{ ns: 'counter', resources }]
});
