import { ActionReducerMap, ActionReducer } from '@ngrx/store';

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
