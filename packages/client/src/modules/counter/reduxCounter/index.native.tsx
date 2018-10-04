import ReduxCounter from './containers/ReduxCounter';
import reducers from './reducers';
import resources from './locales';
import ClientModule from '../../ClientModule';

export default new ClientModule({
  reducer: [{ counter: reducers }],
  localization: [{ ns: 'reduxCounter', resources }]
});

export { ReduxCounter };
