import React from 'react';
import { Route } from 'react-router-dom';

import Counter from './containers/Counter';
import ClientCounterFeature, { ClientCounter } from './clientCounter';
import ReduxCounterFeature, { ReduxCounter } from './reduxCounter';
import ServerCounterFeature, { ServerCounter } from './serverCounter';
import Feature from '../connector';
import resources from './locales';

export default new Feature(ClientCounterFeature, ReduxCounterFeature, ServerCounterFeature, {
  route: <Route exact path="/" component={Counter} />,
  localization: { ns: 'counter', resources }
});

export { ClientCounter, ServerCounter, ReduxCounter };
