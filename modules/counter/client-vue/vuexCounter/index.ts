import CounterModule from '../CounterModule';
import VuexCounter from './containers/VuexCounter.vue';
import reducers from './reducers';

export default new CounterModule({
  reducer: [{ counter: reducers }],
  counterComponent: [VuexCounter]
});
