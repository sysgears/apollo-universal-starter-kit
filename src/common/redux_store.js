import { createStore, combineReducers, applyMiddleware } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import { composeWithDevTools } from 'redux-devtools-extension';

import { reducers } from '../client/modules';

const createReduxStore = (initialState, client, routerMiddleware) => {
  const store = createStore(
    combineReducers({
      apollo: client.reducer(),
      router: routerReducer,
      form: formReducer,

      ...reducers
    }),
    initialState, // initial state
    routerMiddleware ? composeWithDevTools(applyMiddleware(client.middleware(), routerMiddleware))
      : applyMiddleware(client.middleware())
  );

  return store;
};

export default createReduxStore;
