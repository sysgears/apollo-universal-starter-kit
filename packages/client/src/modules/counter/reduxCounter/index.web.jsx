import resources from './locales';
import Feature from '../../connector';
import reducers from './reducers';
import { ReduxCounterButton, ReduxCounterView } from './components/ReduxCounterView';

export default new Feature({
  reducer: { counter: reducers },
  localization: { ns: 'reduxCounter', resources }
});

export { ReduxCounterButton, ReduxCounterView };
