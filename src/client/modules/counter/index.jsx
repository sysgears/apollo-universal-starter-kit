import React from 'react';
import { Route } from 'react-router-dom';

import Counter from './containers/counter';
import reducers from './reducers';

import { addReducers, addRoutes } from '../connector';

addReducers({ counter: reducers });
addRoutes(
  <Route exact path="/" component={Counter}/>
);
