import { createStore, combineReducers, applyMiddleware } from 'redux';
import { routerReducer } from 'react-router-redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

export const getStoreReducer = reducers =>
  combineReducers({
    router: routerReducer,
    ...reducers
  });

const createReduxStore = (reducers, initialState, client, routerMiddleware) => {
  return createStore(
    getStoreReducer(reducers),
    initialState, // initial state
    routerMiddleware ? composeWithDevTools(applyMiddleware(routerMiddleware)) : undefined
  );
};

export default createReduxStore;
