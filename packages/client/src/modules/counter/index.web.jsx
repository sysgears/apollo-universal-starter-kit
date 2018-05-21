import React from 'react';
import { Route } from 'react-router-dom';

import Counter from './Counter';
import resolvers from './clientCounter/resolvers';
import reducers from './reduxCounter/reducers';
import mergeLocalization from './helpers';
import Feature from '../connector';

export default new Feature({
  route: <Route exact path="/" component={Counter} />,
  resolver: resolvers,
  reducer: { counter: reducers },
  localization: {
    ns: 'counter',
    resources: mergeLocalization()
  }
});
