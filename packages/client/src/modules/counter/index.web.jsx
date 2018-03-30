import React from 'react';
import { Route } from 'react-router-dom';

import Counter from './containers/Counter';
import resolvers from './resolvers';
import reducers from './reducers';
import resources from './locales';

import Feature from '../connector';

export default new Feature({
  route: <Route exact path="/" component={Counter} />,
  resolver: resolvers,
  reducer: { counter: reducers },
  localization: { ns: 'counter', resources }
});
