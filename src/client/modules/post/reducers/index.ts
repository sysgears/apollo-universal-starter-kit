import { Action } from '@ngrx/store';

export const COMMENT_SELECT = 'COMMENT_SELECT';

export class CommentSelect implements Action {
  public readonly type = COMMENT_SELECT;

  constructor(public value: { id: number; content: string }) {}
}

export interface PostState {
  comment: { id: null; content: string };
}

export type PostActions = CommentSelect;

const defaultState: PostState = {
  comment: { id: null, content: '' }
};

export function reducer(state = defaultState, action: PostActions) {
  switch (action.type) {
    case COMMENT_SELECT:
      return { ...state, comment: action.value };

    default:
      return state;
  }
}
