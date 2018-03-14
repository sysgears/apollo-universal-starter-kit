import React from 'react';
import { Route } from 'react-router-dom';

import Counter from './containers/Counter.web';
import resolvers from './resolvers/index';
import reducers from './reducers/index';

import Feature from '../connector.web';

export default new Feature({
  route: <Route exact path="/" component={Counter} />,
  resolver: resolvers,
  reducer: { counter: reducers }
});
