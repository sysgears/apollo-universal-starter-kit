import resources from './locales';
import ClientModule from '../../ClientModule';
import reducers from './reducers';
import ReduxCounter from './containers/ReduxCounter';

export default new ClientModule({
  reducer: [{ counter: reducers }],
  localization: [{ ns: 'reduxCounter', resources }]
});

export { ReduxCounter };
