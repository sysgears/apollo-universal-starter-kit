import React from 'react';
import { Route } from 'react-router-dom';

import Counter from './containers/Counter';
import clientCounter from './clientCounter';
import reduxCounter from './reduxCounter';
import serverCounter from './serverCounter';
import Feature from '../connector';
import resources from './locales';

export type TranslateFunc = (msg: string, ...params: any[]) => string;

export default new Feature(clientCounter, reduxCounter, serverCounter, {
  route: <Route exact path="/" component={Counter} />,
  localization: { ns: 'counter', resources }
});
