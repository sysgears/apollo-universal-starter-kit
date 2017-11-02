import { createStore, Reducer, Store } from 'redux';

const defaultState = {
  searchText: '',
  isAdmin: null,
  isActive: null,
  orderBy: {}
};

const reducer: Reducer<any> = (state: any, action: any) => {
  switch (action.type) {
    case 'USER_FILTER_SEARCH_TEXT':
      return {
        ...state,
        searchText: action.value
      };

    case 'USER_FILTER_IS_ADMIN': {
      let isAdmin = null;
      if (action.value === true) {
        isAdmin = true;
      }

      return {
        ...state,
        isAdmin
      };
    }

    case 'USER_FILTER_IS_ACTIVE': {
      let isActive = null;
      if (action.value === true) {
        isActive = true;
      }

      return {
        ...state,
        isActive
      };
    }

    case 'USER_ORDER_BY': {
      return {
        ...state,
        orderBy: action.value
      };
    }

    default:
      return state;
  }
};

export let userStore: Store<any> = createStore(reducer, defaultState);
