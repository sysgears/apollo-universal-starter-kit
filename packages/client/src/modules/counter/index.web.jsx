import React from 'react';
import { Route } from 'react-router-dom';

// eslint-disable-next-line
import resources from '@alienfast/i18next-loader!./locales/index.js';

import Counter from './containers/Counter';
import resolvers from './resolvers/index';
import reducers from './reducers/index';

import Feature from '../connector';

export default new Feature({
  route: <Route exact path="/" component={Counter} />,
  resolver: resolvers,
  reducer: { counter: reducers },
  localization: resources
});
