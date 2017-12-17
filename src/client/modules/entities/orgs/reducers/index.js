// Redux reducer to manage client side state
const defaultState = {
  searchText: '',
  role: '',
  isActive: null,
  orderBy: {}
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case 'ORG_FILTER_SEARCH_TEXT':
      return {
        ...state,
        searchText: action.value
      };

    case 'ORG_FILTER_ROLE':
      return {
        ...state,
        role: action.value
      };

    case 'ORG_FILTER_IS_ACTIVE': {
      let isActive = null;
      if (action.value === true) {
        isActive = true;
      }

      return {
        ...state,
        isActive
      };
    }

    case 'ORG_ORDER_BY':
      return {
        ...state,
        orderBy: action.value
      };

    default:
      return state;
  }
}
