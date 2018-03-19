import { Action } from 'redux';

interface CounterAction extends Action {
  value: any;
}

interface DefaultState {
  reduxCount: number;
}

const defaultState: DefaultState = {
  reduxCount: 1
};

export default function(state = defaultState, action: CounterAction) {
  switch (action.type) {
    case 'COUNTER_INCREMENT':
      return {
        ...state,
        reduxCount: state.reduxCount + action.value
      };

    default:
      return state;
  }
}
