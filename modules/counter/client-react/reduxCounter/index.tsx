import React from 'react';
import resources from './locales';
import CounterModule from '../CounterModule';
import reducers from './reducers';
import ReduxCounter from './containers/ReduxCounter';

export default new CounterModule({
  reducer: [{ counter: reducers }],
  localization: [{ ns: 'reduxCounter', resources }],
  counterComponent: [<ReduxCounter />]
});
