import resources from './locales';
import Feature from '../../connector';
import reducers from './reducers';
import ReduxCounter from './containers/ReduxCounter';

export default new Feature({
  reducer: { counter: reducers },
  localization: { ns: 'reduxCounter', resources }
});

export { ReduxCounter };
