import { reducer } from './reducers';
import resolvers from './resolvers';

import Feature from '../connector';
import CounterView from './components/CounterView.web';

export default new Feature({
  route: [{ path: '', component: CounterView, data: { title: 'Apollo Fullstack Starter Kit - Counter example page' } }],
  reducer: { counter: reducer },
  resolver: resolvers
});
