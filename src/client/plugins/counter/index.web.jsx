import React from 'react';
import { Route } from 'react-router-dom';

import Counter from './containers/Counter';
import reducers from './reducers';

import Plugin from '../plugin';

export default new Plugin({
  route: <Route exact path="/" component={Counter} />,
  reducer: { counter: reducers }
});
