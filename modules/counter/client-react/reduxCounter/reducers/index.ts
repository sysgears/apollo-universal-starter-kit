const defaultState = {
  reduxCount: 1,
};

export default function (state = defaultState, action: any) {
  switch (action.type) {
    case 'COUNTER_INCREMENT':
      return {
        ...state,
        reduxCount: state.reduxCount + action.value,
      };

    default:
      return state;
  }
}
