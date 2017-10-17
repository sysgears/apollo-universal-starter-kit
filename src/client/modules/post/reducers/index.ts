import { Action, createStore, Reducer, Store } from 'redux';

export interface PostState {
  comment: { id: any; content: string };
}

export interface PostAction extends Action {
  value?: { id: any; content: string };
}

const defaultState: PostState = {
  comment: { id: 0, content: '' }
};

const reducer: Reducer<PostState> = (state: PostState, action: PostAction) => {
  switch (action.type) {
    case 'COMMENT_SELECT':
      return { ...state, comment: action.value };

    default:
      return state;
  }
};

export let postStore: Store<PostState> = createStore(reducer, defaultState);
