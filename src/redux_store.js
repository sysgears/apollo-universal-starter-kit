import { createStore, combineReducers, applyMiddleware } from 'redux';
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'
import { composeWithDevTools } from 'redux-devtools-extension';

import CounterReducers from './store/reducers/counter_reducers';
import PostReducers from './store/reducers/post_reducers';

const createReduxStore = (initialState, client, routerMiddleware) => {
  const store = createStore(
    combineReducers({
      counter: CounterReducers,
      post: PostReducers,
      apollo: client.reducer(),
      router: routerReducer,
      form: formReducer
    }),
    initialState, // initial state
    routerMiddleware ? composeWithDevTools(applyMiddleware(client.middleware(), routerMiddleware))
      : applyMiddleware(client.middleware())
  );

  return store;
};

export default createReduxStore;
