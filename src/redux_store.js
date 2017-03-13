import { createStore, combineReducers, applyMiddleware } from 'redux';
import { routerReducer } from 'react-router-redux'
import { composeWithDevTools } from 'redux-devtools-extension';

import CounterReducers from './store/reducers/counter_reducers';

const createReduxStore = (initialState, client, routerMiddleware) => {
  const store = createStore(
    combineReducers({
      counter: CounterReducers,
      apollo: client.reducer(),
      router: routerReducer
    }),
    initialState, // initial state
    routerMiddleware ? composeWithDevTools(applyMiddleware(client.middleware(), routerMiddleware))
      : applyMiddleware(client.middleware())
  );

  return store;
};

export default createReduxStore;
