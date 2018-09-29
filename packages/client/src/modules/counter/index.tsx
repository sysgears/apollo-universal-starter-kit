import React from 'react';
import { Route } from 'react-router-dom';

import Counter from './containers/Counter';
import clientCounter from './clientCounter';
import reduxCounter from './reduxCounter';
import serverCounter from './serverCounter';
import ClientModule from '../ClientModule';
import resources from './locales';

export default new ClientModule(clientCounter, reduxCounter, serverCounter, {
  route: [<Route exact path="/" component={Counter} />],
  localization: [{ ns: 'counter', resources }]
});
