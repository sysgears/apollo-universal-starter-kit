import { createStore, Reducer, Store } from 'redux';

const reducer: Reducer<any> = (state: any, action: any) => {
  switch (action.type) {
    default:
      return state;
  }
};

export let userStore: Store<any> = createStore(reducer, {});
