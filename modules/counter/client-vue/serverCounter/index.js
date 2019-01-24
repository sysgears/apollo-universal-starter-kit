import { resolvers } from '@module/counter-common';
import ServerCounter from './containers/ServerCounter.vue';
import CounterModule from '../CounterModule';

export default new CounterModule({
  resolver: [resolvers],
  counterComponent: [ServerCounter]
});
