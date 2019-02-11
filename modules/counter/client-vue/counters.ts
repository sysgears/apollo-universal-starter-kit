import CounterModule from './CounterModule';

import clientCounter from './clientCounter';
import vuexCounter from './vuexCounter';
import serverCounter from './serverCounter';

export default new CounterModule(clientCounter, vuexCounter, serverCounter);
