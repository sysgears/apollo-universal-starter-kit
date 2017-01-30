import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { routerReducer } from 'react-router-redux'
import CounterReducers from './store/reducers/counter_reducers';

const createReduxStore = (initialState, client) => {
  const store = createStore(
    combineReducers({
      counter: CounterReducers,
      apollo: client.reducer(),
      routing: routerReducer
    }),
    initialState, // initial state
    compose(
      applyMiddleware(client.middleware()),
      // If you are using the devToolsExtension, you can add it here also
      (typeof window !== 'undefined' && window.devToolsExtension) ? window.devToolsExtension() : f => f
    )
  );
  return store;
};

export default createReduxStore;
