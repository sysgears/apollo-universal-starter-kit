import React from 'react';
import { Route } from 'react-router-dom';

import Counter from './containers/Counter';
import ClientCounter from './clientCounter';
import ReduxCounter from './reduxCounter';
import ServerCounter from './serverCounter';
import Feature from '../connector';
import resources from './locales';
import ClientCounterContainer from './clientCounter/containers/ClientCounter';
import ServerCounterContainer from './serverCounter/containers/ServerCounter';
import ReduxCounterContainer from './reduxCounter/containers/ReduxCounter';

export default new Feature(ClientCounter, ReduxCounter, ServerCounter, {
  route: <Route exact path="/" component={Counter} />,
  localization: { ns: 'counter', resources }
});

export { ClientCounterContainer, ServerCounterContainer, ReduxCounterContainer };
