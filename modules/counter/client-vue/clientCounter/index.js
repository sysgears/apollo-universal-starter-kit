import { resolvers } from '@module/counter-common';
import ClientCounter from './containers/ClientCounter.vue';
import CounterModule from '../CounterModule';

export default new CounterModule({
  resolver: [resolvers],
  // localization: [ { ns: 'clientCounter', resources } ],
  counterComponent: [ClientCounter]
});
