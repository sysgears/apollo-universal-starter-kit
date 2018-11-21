import React from 'react';
import resolvers from './resolvers';
import resources from './locales';
import ClientCounter from './containers/ClientCounter';
import CounterModule from '../CounterModule';

export default new CounterModule({
  resolver: [resolvers],
  localization: [{ ns: 'clientCounter', resources }],
  counterComponent: [<ClientCounter />]
});
