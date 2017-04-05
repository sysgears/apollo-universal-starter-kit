import { createStore, combineReducers, applyMiddleware } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'
import { composeWithDevTools } from 'redux-devtools-extension'

import CounterReducers from './ui/counter/reducers/counter_reducers'
import PostReducers from './modules/post/ui/reducers/post_reducers'

const createReduxStore = (initialState, client, routerMiddleware) => {
  const store = createStore(
    combineReducers({
      apollo: client.reducer(),
      router: routerReducer,
      form: formReducer,

      counter: CounterReducers,
      post: PostReducers,
    }),
    initialState, // initial state
    routerMiddleware ? composeWithDevTools(applyMiddleware(client.middleware(), routerMiddleware))
      : applyMiddleware(client.middleware())
  );

  return store;
};

export default createReduxStore;
