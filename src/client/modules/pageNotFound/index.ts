import Feature from '../connector';
import PageNotFound from './containers/PageNotFound';

export default new Feature({
  route: [{ path: '**', component: PageNotFound }]
});
