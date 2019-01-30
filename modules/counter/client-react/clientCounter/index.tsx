import React from 'react';

import resources from './locales';
import { resolvers } from '@gqlapp/counter-common';
import ClientCounter from './containers/ClientCounter';
import CounterModule from '../CounterModule';

export default new CounterModule({
  resolver: [resolvers],
  localization: [{ ns: 'clientCounter', resources }],
  counterComponent: [<ClientCounter />]
});
