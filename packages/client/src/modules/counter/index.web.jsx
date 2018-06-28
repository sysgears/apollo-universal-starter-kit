import React from 'react';
import { Route } from 'react-router-dom';

import Counter from './Counter';
import ClientCounter from './clientCounter';
import ReduxCounter from './reduxCounter';
import ServerCounter from './serverCounter';
import Feature from '../connector';
import resources from './locales';

export default new Feature(ClientCounter, ReduxCounter, ServerCounter, {
  route: <Route exact path="/" component={Counter} />,
  localization: { ns: 'counter', resources }
});
