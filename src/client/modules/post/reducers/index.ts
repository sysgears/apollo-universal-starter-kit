import { Action } from '@ngrx/store';
import { createFormGroupState, FormGroupState, groupUpdateReducer, validate } from 'ngrx-forms';

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

function required(value: any) {
  return value && value.toString().length ? {} : { required: 'Field is required' };
}

/* Post Form */

const POST_FORM = 'post_form';
const POST_FORM_RESET = 'post_form_reset';
const POST_FORM_FILL = 'post_form_fill';

export interface PostFormData {
  title: string;
  content: string;
}

const initPostForm = createFormGroupState<PostFormData>(POST_FORM, {
  title: '',
  content: ''
});

const updatePostFormData = groupUpdateReducer<PostFormData>({
  title: validate(required),
  content: validate(required)
});

export interface PostFormState {
  postForm: FormGroupState<PostFormData>;
}

const initPostFormState: PostFormState = {
  postForm: initPostForm
};

export interface PostFormAction extends Action {
  formData?: PostFormData;
}

export class ResetPostFormAction implements PostFormAction {
  public readonly type = POST_FORM_RESET;
}

export class FillPostFormAction implements PostFormAction {
  public readonly type = POST_FORM_FILL;
  public formData: PostFormData;

  constructor(fd: PostFormData) {
    this.formData = fd;
  }
}

export function postFormReducer(state = initPostFormState, action: PostFormAction) {
  const postForm = updatePostFormData(state.postForm, action);

  if (postForm !== state.postForm) {
    state = { ...state, postForm } as any;
  }

  switch (action.type) {
    case POST_FORM_RESET:
      return {
        ...state,
        postForm: initPostForm
      };
    case POST_FORM_FILL:
      return {
        ...state,
        postForm: updatePostFormData(createFormGroupState<PostFormData>(POST_FORM, action.formData), { type: '' })
      };

    default:
      return state;
  }
}
