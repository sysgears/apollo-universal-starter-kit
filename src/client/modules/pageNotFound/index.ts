import { Feature } from '../connector';
import { PageNotFound } from './containers/PageNotFound';

export const pageNotFound = new Feature({
  route: [{ path: '**', component: PageNotFound }]
});
