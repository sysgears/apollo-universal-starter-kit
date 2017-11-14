import { Action } from '@ngrx/store';
import { AbstractControlState, createFormGroupState, FormGroupState, groupUpdateReducer, validate } from 'ngrx-forms';

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

/* FORM REDUCERS */

const LOGIN_FORM = 'login_form';

const RESET_FORM_ACTION = 'reset_form_action';
const FILL_FORM_ACTION = 'fill_form_action';

function required(value: any) {
  return value && value.toString().length ? {} : { required: 'Field is required' };
}

function emailPattern(value: string) {
  return value && value.length && /^[a-zA-Z0–9_.+-]+@[a-zA-Z0–9-]+\.[a-zA-Z0–9.]+$/.test(value)
    ? {}
    : { email: 'Email should be like john@doe.com' };
}

// Login Form

export interface LoginFormData {
  email: string;
  password: string;
}

const initLoginForm = createFormGroupState<LoginFormData>(LOGIN_FORM, {
  email: '',
  password: ''
});

const updateLoginFormData = groupUpdateReducer<LoginFormData>(
  {
    email: validate(required),
    password: validate(required)
  },
  {
    email: validate(emailPattern)
  }
  // {
  //   email: (email: AbstractControlState<string>, form: FormGroupState<LoginFormData>) => {
  //     if (!form.value.email.length) {
  //     } else if (!/^[a-zA-Z0–9_.+-]+@[a-zA-Z0–9-]+\.[a-zA-Z0–9.]+$/.test(form.value.email)) {
  //     }
  //     console.log(form.controls.email.errors);
  //     return email;
  //   }
  // }
);

export interface LoginFormState {
  loginForm: FormGroupState<LoginFormData>;
}

const initLoginFormState: LoginFormState = {
  loginForm: initLoginForm
};

export interface LoginFormAction extends Action {
  formData?: LoginFormData;
}

export class ResetLoginFormAction implements LoginFormAction {
  public readonly type = RESET_FORM_ACTION;
}

export class FillLoginFormAction implements LoginFormAction {
  public readonly type = FILL_FORM_ACTION;
  public formData: LoginFormData;

  constructor(fd: LoginFormData) {
    this.formData = fd;
  }
}

export function loginFormReducer(state = initLoginFormState, action: Action) {
  const loginForm = updateLoginFormData(state.loginForm, action);

  if (loginForm !== state.loginForm) {
    state = { ...state, loginForm } as any;
  }

  switch (action.type) {
    case RESET_FORM_ACTION:
      return {
        ...state,
        loginForm: initLoginForm
      };
    case FILL_FORM_ACTION:
      return {
        loginForm: createFormGroupState<LoginFormData>(LOGIN_FORM, (action as LoginFormAction).formData)
      };

    default:
      return state;
  }
}

const FORGOT_PASSWORD_FORM = 'forgot_password_form';

// Login Form

export interface ForgotPasswordFormData {
  email: string;
}

const initForgotPasswordForm = createFormGroupState<ForgotPasswordFormData>(FORGOT_PASSWORD_FORM, {
  email: ''
});

const updateForgotPasswordFormData = groupUpdateReducer<ForgotPasswordFormData>(
  {
    email: validate(required)
  },
  {
    email: validate(emailPattern)
  }
);

export interface ForgotPasswordFormState {
  forgotPasswordForm: FormGroupState<ForgotPasswordFormData>;
}

const initForgotPasswordState: ForgotPasswordFormState = {
  forgotPasswordForm: initForgotPasswordForm
};

export interface ForgotPasswordFormAction extends Action {
  formData?: ForgotPasswordFormData;
}

export class ResetForgotPasswordFormAction implements ForgotPasswordFormAction {
  public readonly type = RESET_FORM_ACTION;
}

export class FillForgotPasswordFormAction implements ForgotPasswordFormAction {
  public readonly type = FILL_FORM_ACTION;
  public formData: ForgotPasswordFormData;

  constructor(fd: ForgotPasswordFormData) {
    this.formData = fd;
  }
}

export function forgotPasswordFormReducer(state = initForgotPasswordState, action: Action) {
  const forgotPasswordForm = updateForgotPasswordFormData(state.forgotPasswordForm, action);

  if (forgotPasswordForm !== state.forgotPasswordForm) {
    state = { ...state, forgotPasswordForm } as any;
  }

  switch (action.type) {
    case RESET_FORM_ACTION:
      return {
        ...state,
        forgotPasswordForm: initForgotPasswordForm
      };
    case FILL_FORM_ACTION:
      return {
        forgotPasswordForm: createFormGroupState<ForgotPasswordFormData>(
          FORGOT_PASSWORD_FORM,
          (action as ForgotPasswordFormAction).formData
        )
      };

    default:
      return state;
  }
}
