import React from 'react';
import { Route } from 'react-router-dom';

import Counter from './containers/Counter';
import ClientCounter, { ClientCounterContainer } from './clientCounter';
import ReduxCounter, { ReduxCounterContainer } from './reduxCounter';
import ServerCounter, { ServerCounterContainer } from './serverCounter';
import Feature from '../connector';
import resources from './locales';

export default new Feature(ClientCounter, ReduxCounter, ServerCounter, {
  route: <Route exact path="/" component={Counter} />,
  localization: { ns: 'counter', resources }
});

export { ClientCounterContainer, ServerCounterContainer, ReduxCounterContainer };
