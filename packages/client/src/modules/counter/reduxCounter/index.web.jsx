import resources from './locales/index';
import Feature from '../../connector';
import reducers from './reducers/index';

export default new Feature({
  reducer: { counter: reducers },
  localization: { ns: 'reduxCounter', resources }
});
