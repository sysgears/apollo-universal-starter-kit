import resources from './locales';
import Feature from '../../connector';
import reducers from './reducers';

export default new Feature({
  reducer: { counter: reducers },
  localization: { ns: 'reduxCounter', resources }
});
