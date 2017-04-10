import React from 'react';
import { Route } from 'react-router-dom';

import Counter from './containers/counter';
import reducers from './reducers';

export const getReducers = () => ({ counter: reducers });

export const getRoutes = () => [ (
  <Route exact path="/" component={Counter}/>
) ];