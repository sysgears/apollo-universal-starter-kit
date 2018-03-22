import React from 'react';
import { Route } from 'react-router-dom';

import Counter from './containers/Counter.web';
import clientStateParams from './resolvers';
import reducers from './reducers';

import Feature from '../connector.web';

export default new Feature({
  route: <Route exact path="/" component={Counter} />,
  clientStateParams,
  reducer: { counter: reducers }
});
