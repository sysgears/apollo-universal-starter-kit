const defaultState = {
  comment: { id: null, content: '' }
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case 'COMMENT_SELECT':
      return {
        ...state,
        comment: action.value
      };

    default:
      return state;
  }
}
