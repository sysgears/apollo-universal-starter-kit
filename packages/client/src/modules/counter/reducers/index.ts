interface Action {
  type: string;
  value: any;
}

interface DefaultState {
  reduxCount: number;
}

const defaultState: DefaultState = {
  reduxCount: 1
};

export default function(state = defaultState, action: Action) {
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
