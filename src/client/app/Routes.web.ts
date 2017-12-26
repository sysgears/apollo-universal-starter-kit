import { modules } from './components';
import { CounterView } from './components/counter/components/CounterView.web';

// export const routes = modules.routes;
export const routes = [
  { path: '', component: CounterView, data: { title: 'Apollo Fullstack Starter Kit - Counter example page' } }
];
