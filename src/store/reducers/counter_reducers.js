const defaultState = {
  test: 1
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case 'COUNTER_TEST_INCREMENT':
      return {
        ...state,
        test: state.test = state.test + action.value
      };

    default:
      return state;
  }
}