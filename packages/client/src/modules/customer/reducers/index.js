const defaultState = {
  title: 'Customer',
  link: 'customer',
  nativeLink: 'CustomerEdit',
  limit: 50,
  searchText: '',
  orderBy: {}
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case 'CUSTOMER_LIMIT':
      return {
        ...state,
        limit: action.value
      };

    case 'CUSTOMER_FILTER_SEARCH_TEXT':
      return {
        ...state,
        searchText: action.value
      };

    case 'CUSTOMER_ORDER_BY':
      return {
        ...state,
        orderBy: action.value
      };

    default:
      return state;
  }
}
