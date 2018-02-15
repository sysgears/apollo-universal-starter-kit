const defaultState = {
  title: 'Test Module',
  link: 'testModule',
  nativeLink: 'TestModuleEdit',
  limit: 50,
  searchText: '',
  orderBy: {}
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case 'TESTMODULE_LIMIT':
      return {
        ...state,
        limit: action.value
      };

    case 'TESTMODULE_FILTER_SEARCH_TEXT':
      return {
        ...state,
        searchText: action.value
      };

    case 'TESTMODULE_ORDER_BY':
      return {
        ...state,
        orderBy: action.value
      };

    default:
      return state;
  }
}
