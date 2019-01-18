import CounterModule from './CounterModule';
import clientCounter from './clientCounter';
import vuexCounter from './vuexCounter';

export default new CounterModule(clientCounter, vuexCounter);
