import { Action } from '@ngrx/store';

export const USER_FILTER_SEARCH_TEXT = 'USER_FILTER_SEARCH_TEXT';
export const USER_FILTER_ROLE = 'USER_FILTER_ROLE';
export const USER_FILTER_IS_ACTIVE = 'USER_FILTER_IS_ACTIVE';
export const USER_ORDER_BY = 'USER_ORDER_BY';

export class UserFilterSearchText implements Action {
  public readonly type = USER_FILTER_SEARCH_TEXT;

  constructor(public value: string) {}
}

export class UserFilterRole implements Action {
  public readonly type = USER_FILTER_ROLE;

  constructor(public value: string) {}
}

export class UserFilterIsActive implements Action {
  public readonly type = USER_FILTER_IS_ACTIVE;

  constructor(public value: boolean) {}
}

export class UserOrderBy implements Action {
  public readonly type = USER_ORDER_BY;

  constructor(public value: any) {}
}

export type UserActions = UserFilterSearchText | UserFilterRole | UserFilterIsActive | UserOrderBy;

export interface UserState {
  searchText: string;
  role: string;
  isActive: boolean;
  orderBy: any;
}

const defaultState: UserState = {
  searchText: '',
  role: '',
  isActive: null,
  orderBy: {}
};

export function reducer(state = defaultState, action: UserActions) {
  switch (action.type) {
    case USER_FILTER_SEARCH_TEXT:
      return {
        ...state,
        searchText: action.value
      };

    case USER_FILTER_ROLE: {
      return {
        ...state,
        role: action.value
      };
    }

    case USER_FILTER_IS_ACTIVE: {
      let isActive = null;
      if (action.value === true) {
        isActive = true;
      }

      return {
        ...state,
        isActive
      };
    }

    case USER_ORDER_BY: {
      return {
        ...state,
        orderBy: action.value
      };
    }

    default:
      return state;
  }
}
