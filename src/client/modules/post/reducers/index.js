const defaultState = {
  endCursor: '0',
  comment: { id: null, content: '' }
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case 'COMMENT_SELECT':
      return {
        ...state,
        comment: action.value
      };

    case 'POST_ENDCURSOR':
      return {
        ...state,
        endCursor: action.value
      };

    default:
      return state;
  }
}
