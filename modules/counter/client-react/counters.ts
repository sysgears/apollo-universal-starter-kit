import clientCounter from './clientCounter';
import reduxCounter from './reduxCounter';
import serverCounter from './serverCounter';

import CounterModule from './CounterModule';

export default new CounterModule(clientCounter, reduxCounter, serverCounter);
