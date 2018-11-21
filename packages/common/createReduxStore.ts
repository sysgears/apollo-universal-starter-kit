import { createStore, combineReducers, applyMiddleware, ReducersMapObject } from 'redux';
import { routerReducer } from 'react-router-redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

export const getStoreReducer = (reducers: ReducersMapObject) =>
  combineReducers({
    router: routerReducer,
    ...reducers
  });

const createReduxStore = (reducers: ReducersMapObject, initialState: any, client: any, routerMiddleware: any) => {
  return createStore(
    getStoreReducer(reducers),
    initialState, // initial state
    routerMiddleware ? composeWithDevTools(applyMiddleware(routerMiddleware)) : undefined
  );
};

export default createReduxStore;
