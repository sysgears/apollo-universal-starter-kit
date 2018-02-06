const defaultState = {
  title: '$MoDuLe$',
  link: '$module$',
  nativeLink: '$Module$Edit',
  limit: 50,
  searchText: '',
  orderBy: {}
};

export default function (state = defaultState, action) {
  switch (action.type) {
    case '$MODULE$_LIMIT':
      return {
        ...state,
        limit: action.value
      };

    case '$MODULE$_FILTER_SEARCH_TEXT':
      return {
        ...state,
        searchText: action.value
      };

    case '$MODULE$_ORDER_BY':
      return {
        ...state,
        orderBy: action.value
      };

    default:
      return state;
  }
}
