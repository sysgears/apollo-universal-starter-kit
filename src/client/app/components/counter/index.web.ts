import { reducer } from './reducers';

import { Feature } from '../connector';
import { CounterView } from './components/CounterView.web';

export const counter = new Feature({
  route: [{ path: '', component: CounterView, data: { title: 'Apollo Fullstack Starter Kit - Counter example page' } }],
  reducer: { counter: reducer }
});
