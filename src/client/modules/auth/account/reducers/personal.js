const defaultState = {
  editingPersonal: false,
  saving: false
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case 'PERSONAL_EDIT_START':
      return {
        ...state,
        editingPersonal: true
      };

    case 'PERSONAL_EDIT_CANCEL':
      return {
        ...state,
        editingPersonal: false
      };

    default:
      return state;
  }
}
