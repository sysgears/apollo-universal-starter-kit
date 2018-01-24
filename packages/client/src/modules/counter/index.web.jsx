import React from 'react';
import { Route } from 'react-router-dom';

import Counter from './containers/Counter';
import reducers from './reducers';

import Feature from '../connector';

export default new Feature({
  route: <Route exact path="/" component={Counter} />,
  reducer: { counter: reducers }
});
