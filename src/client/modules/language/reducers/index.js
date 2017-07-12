import { DEFAULT_LOCALE, CHANGE_LOCALE } from '../constants';

const defaultState = {
  locale: DEFAULT_LOCALE
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case CHANGE_LOCALE:
      return {
        ...state,
        locale: action.locale
      };

    default:
      return state;
  }
}
