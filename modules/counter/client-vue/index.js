import ClientModule from '@module/module-client-vue';
import counters from './counters';
import Counter from './containers/Counter.vue';

export default new ClientModule(counters, {
  route: [{ path: '/', name: 'Counter', component: Counter }]
  // localization: [ { ns: 'counter', resources } ]
});
