import { createStore, combineReducers, applyMiddleware, Store, Reducer, DeepPartial, Middleware } from 'redux';
import { routerReducer } from 'react-router-redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

export const getStoreReducer = (reducers: any) =>
  combineReducers({
    router: routerReducer,
    ...reducers
  });

const createReduxStore = (
  reducers: Reducer,
  initialState: DeepPartial<any>,
  client: any,
  routerMiddleware: Middleware
): Store => {
  return createStore(
    getStoreReducer(reducers),
    initialState, // initial state
    routerMiddleware ? composeWithDevTools(applyMiddleware(routerMiddleware)) : undefined
  );
};

export default createReduxStore;
