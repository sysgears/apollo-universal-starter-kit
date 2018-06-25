import React from 'react';
import { Route } from 'react-router-dom';

import Counter from './Counter';
import ClientCounter from './modules/clientCounter';
import ReduxCounter from './modules/reduxCounter';
import ServerCounter from './modules/serverCounter';
import Feature from '../connector';

export default new Feature(ClientCounter, ReduxCounter, ServerCounter, {
  route: <Route exact path="/" component={Counter} />
});
