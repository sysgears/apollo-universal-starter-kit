import React from 'react';
import { Route } from 'react-router-dom';

import ClientModule from '@gqlapp/module-client-react';
import Counter from './containers/Counter';
import counters from './counters';
import resources from './locales';

export default new ClientModule(counters, {
  route: [<Route exact path={__TEST__ ? '/counter' : '/'} component={Counter} />],
  localization: [{ ns: 'counter', resources }],
});
