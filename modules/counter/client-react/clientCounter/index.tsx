import React from 'react';

import resources from './locales';
import ClientCounter from './containers/ClientCounter';
import CounterModule from '../CounterModule';
import { resolvers } from '@module/counter-common';

export default new CounterModule({
  resolver: [resolvers],
  localization: [{ ns: 'clientCounter', resources }],
  counterComponent: [<ClientCounter />]
});
