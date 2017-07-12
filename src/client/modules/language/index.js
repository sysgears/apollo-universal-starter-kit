// Reducers
import reducers from './reducers';

// Components
import Feature from '../connector';

export default new Feature({
  reducer: { language: reducers }
});
