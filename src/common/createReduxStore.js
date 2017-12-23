import { createStore, combineReducers, applyMiddleware } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import plugins from '../client/plugins';

export const storeReducer = combineReducers({
  router: routerReducer,
  form: formReducer,
  ...plugins.reducers
});

const createReduxStore = (initialState, client, routerMiddleware) => {
  return createStore(
    storeReducer,
    initialState, // initial state
    routerMiddleware ? composeWithDevTools(applyMiddleware(routerMiddleware)) : undefined
  );
};

export default createReduxStore;
