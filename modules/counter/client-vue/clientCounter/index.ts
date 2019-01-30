import { resolvers } from '@gqlapp/counter-common';

import ClientCounter from './containers/ClientCounter.vue';
import CounterModule from '../CounterModule';

export default new CounterModule({
  resolver: [resolvers],
  counterComponent: [ClientCounter]
});
