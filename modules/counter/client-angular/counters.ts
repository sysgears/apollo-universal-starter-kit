import clientCounter from './clientCounter';
import ngrxCounter from './ngrxCounter';
import serverCounter from './serverCounter';

import CounterModule from './CounterModule';

export default new CounterModule(clientCounter, ngrxCounter, serverCounter);
