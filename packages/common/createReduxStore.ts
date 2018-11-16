import { ActionReducerMap, ActionReducer, Action } from '@ngrx/store';

import modules from '../client/src/modules';

export const reducers: ActionReducerMap<any> = {
  ...modules.reducers
};

function stateSetter(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state: any, action: any) => {
    if (action.type === 'SET_ROOT_STATE') {
      return action.payload;
    }
    return reducer(state, action);
  };
}

export const metaReducers: Array<ActionReducer<any, any>> = [stateSetter];

// import { createStore, combineReducers, applyMiddleware } from 'redux';
// import { routerReducer } from 'react-router-redux';
// import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

// import modules from '../client/src/modules';

// export const storeReducer = combineReducers({
//   router: routerReducer,
//   ...modules.reducers
// });

// const createReduxStore = (initialState, client, routerMiddleware) => {
//   return createStore(
//     storeReducer,
//     initialState, // initial state
//     routerMiddleware ? composeWithDevTools(applyMiddleware(routerMiddleware)) : undefined
//   );
// };

// export default createReduxStore;
