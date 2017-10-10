// Redux reducer to manage client side state
const defaultState = {
  searchText: '',
  isAdmin: null,
  orderBy: {}
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case 'USER_FILTER_SEARCH_TEXT':
      return {
        ...state,
        searchText: action.value
      };

    case 'USER_FILTER_IS_ADMIN':
      let isAdmin = null;
      if (action.value === true) {
        isAdmin = true;
      }

      return {
        ...state,
        isAdmin
      };

    case 'USER_ORDER_BY':
      return {
        ...state,
        orderBy: action.value
      };

    default:
      return state;
  }
}
