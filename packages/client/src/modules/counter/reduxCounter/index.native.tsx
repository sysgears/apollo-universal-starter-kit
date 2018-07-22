import ReduxCounter from './containers/ReduxCounter';
import reducers from './reducers';
import resources from './locales';
import Feature from '../../connector';

export default new Feature({
  reducer: { counter: reducers },
  localization: { ns: 'reduxCounter', resources }
});

export { ReduxCounter };
