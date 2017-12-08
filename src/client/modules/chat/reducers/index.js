const defaultState = {
  message: { id: null, content: '' }
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case 'MESSAGE_SELECT':
      return {
        ...state,
        message: action.value
      };

    default:
      return state;
  }
}
