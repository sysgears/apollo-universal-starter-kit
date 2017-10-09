import { Action, createStore, Reducer, Store } from 'redux';
import { COUNTER } from './actionTypes';

export interface CounterState {
  reduxCount: number;
}

export interface CounterAction extends Action {
  value?: number;
}

const defaultState: CounterState = {
  reduxCount: 1
};

const reducer: Reducer<CounterState> = (state: CounterState, action: CounterAction) => {
  switch (action.type) {
    case COUNTER.INCREMENT:
      return { reduxCount: ++state.reduxCount };
    case COUNTER.INCREASE:
      return { reduxCount: state.reduxCount + action.value };
    default:
      return state;
  }
};

export let counterStore: Store<CounterState> = createStore(reducer, defaultState);
