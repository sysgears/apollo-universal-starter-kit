import React from 'react';
import resources from './locales';
import CounterModule from '../CounterModule';
import ServerCounter from './containers/ServerCounter';

export default new CounterModule({
  localization: [{ ns: 'serverCounter', resources }],
  counterComponent: [<ServerCounter />]
});
