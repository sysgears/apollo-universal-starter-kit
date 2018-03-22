import { Action } from 'redux';
import { Counter } from '../types';

interface CounterAction extends Action {
  value: any;
}

export interface CounterReduxState {
  counter: Counter;
}

const defaultState: CounterReduxState = {
  counter: {
    amount: 1
  }
};

export default function(state = defaultState, action: CounterAction): CounterReduxState {
  switch (action.type) {
    case 'COUNTER_INCREMENT':
      return {
        ...state,
        counter: {
          amount: state.counter.amount + action.value
        }
      };

    default:
      return state;
  }
}
