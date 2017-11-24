import { Action } from '@ngrx/store';
import {
  AbstractControlState,
  createFormGroupState,
  FormGroupState,
  groupUpdateReducer,
  setValue,
  validate
} from 'ngrx-forms';

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

function required(value: any) {
  return value && value.toString().length ? {} : { required: 'Field is required' };
}

const emailValidation = (email: AbstractControlState<string>) => {
  if (!email.value || !email.value.length) {
    return validate(() => ({ required: 'Email is required' }), setValue(email.value, email));
  }

  if (
    !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email.value
    )
  ) {
    return validate(() => ({ email: 'Email should be like john@doe.com' }), setValue(email.value, email));
  }

  return validate(() => ({}), setValue(email.value, email));
};

const passwordConfirmationValidation = (
  passwordConfirmation: AbstractControlState<string>,
  form: FormGroupState<RegisterFormData>
) => {
  if (!passwordConfirmation.value || !passwordConfirmation.value.length) {
    return validate(
      () => ({ required: 'Password Confirmation is required' }),
      setValue(passwordConfirmation.value, passwordConfirmation)
    );
  }

  if (form.controls.password.value !== passwordConfirmation.value) {
    return validate(
      () => ({ passwordConfirmation: 'Should match to password' }),
      setValue(passwordConfirmation.value, passwordConfirmation)
    );
  }

  return validate(() => ({}), setValue(passwordConfirmation.value, passwordConfirmation));
};

/* Forgot Password Form */

const LOGIN_FORM = 'login_form';
const LOGIN_FORM_RESET = 'login_form_reset';
const LOGIN_FORM_FILL = 'login_form_fill';

export interface LoginFormData {
  email: string;
  password: string;
}

const initLoginForm = createFormGroupState<LoginFormData>(LOGIN_FORM, {
  email: '',
  password: ''
});

const updateLoginFormData = groupUpdateReducer<LoginFormData>({
  email: emailValidation,
  password: validate(required)
});

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
  public readonly type = LOGIN_FORM_RESET;
}

export class FillLoginFormAction implements LoginFormAction {
  public readonly type = LOGIN_FORM_FILL;
  public formData: LoginFormData;

  constructor(fd: LoginFormData) {
    this.formData = fd;
  }
}

export function loginFormReducer(state = initLoginFormState, action: LoginFormAction) {
  const loginForm = updateLoginFormData(state.loginForm, action);

  if (loginForm !== state.loginForm) {
    state = { ...state, loginForm } as any;
  }

  switch (action.type) {
    case LOGIN_FORM_RESET:
      return {
        ...state,
        loginForm: initLoginForm
      };
    case LOGIN_FORM_FILL:
      return {
        ...state,
        loginForm: updateLoginFormData(createFormGroupState<LoginFormData>(LOGIN_FORM, action.formData), { type: '' })
      };

    default:
      return state;
  }
}

/* Forgot Password Form */

const FORGOT_PASSWORD_FORM = 'forgot_password_form';
const FORGOT_PASSWORD_FORM_RESET = 'forgot_password_form_reset';
const FORGOT_PASSWORD_FORM_FILL = 'forgot_password_form_fill';

export interface ForgotPasswordFormData {
  email: string;
}

const initForgotPasswordForm = createFormGroupState<ForgotPasswordFormData>(FORGOT_PASSWORD_FORM, {
  email: ''
});

const updateForgotPasswordFormData = groupUpdateReducer<ForgotPasswordFormData>({
  email: emailValidation
});

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
  public readonly type = FORGOT_PASSWORD_FORM_RESET;
}

export class FillForgotPasswordFormAction implements ForgotPasswordFormAction {
  public readonly type = FORGOT_PASSWORD_FORM_FILL;
  public formData: ForgotPasswordFormData;

  constructor(fd: ForgotPasswordFormData) {
    this.formData = fd;
  }
}

export function forgotPasswordFormReducer(state = initForgotPasswordState, action: ForgotPasswordFormAction) {
  const forgotPasswordForm = updateForgotPasswordFormData(state.forgotPasswordForm, action);

  if (forgotPasswordForm !== state.forgotPasswordForm) {
    state = { ...state, forgotPasswordForm } as any;
  }

  switch (action.type) {
    case FORGOT_PASSWORD_FORM_RESET:
      return {
        ...state,
        forgotPasswordForm: initForgotPasswordForm
      };
    case FORGOT_PASSWORD_FORM_FILL:
      return {
        ...state,
        forgotPasswordForm: updateForgotPasswordFormData(
          createFormGroupState<ForgotPasswordFormData>(FORGOT_PASSWORD_FORM, action.formData),
          { type: '' }
        )
      };

    default:
      return state;
  }
}

/* Register Form */

const REGISTER_FORM = 'register_form';
const REGISTER_FORM_RESET = 'register_form_reset';
const REGISTER_FORM_FILL = 'register_form_fill';

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

const initRegisterForm = createFormGroupState<RegisterFormData>(REGISTER_FORM, {
  username: '',
  email: '',
  password: '',
  passwordConfirmation: ''
});

const updateRegisterFormData = groupUpdateReducer<RegisterFormData>({
  username: validate(required),
  email: emailValidation,
  password: validate(required),
  passwordConfirmation: passwordConfirmationValidation
});

export interface RegisterFormState {
  registerForm: FormGroupState<RegisterFormData>;
}

const initRegisterState: RegisterFormState = {
  registerForm: initRegisterForm
};

export interface RegisterFormAction extends Action {
  formData?: RegisterFormData;
}

export class ResetRegisterFormAction implements RegisterFormAction {
  public readonly type = REGISTER_FORM_RESET;
}

export class FillRegisterFormAction implements RegisterFormAction {
  public readonly type = REGISTER_FORM_FILL;
  public formData: RegisterFormData;

  constructor(fd: RegisterFormData) {
    this.formData = fd;
  }
}

export function registerFormReducer(state = initRegisterState, action: RegisterFormAction) {
  const registerForm = updateRegisterFormData(state.registerForm, action);

  if (registerForm !== state.registerForm) {
    state = { ...state, registerForm } as any;
  }

  switch (action.type) {
    case REGISTER_FORM_RESET:
      return {
        ...state,
        registerForm: initRegisterForm
      };
    case REGISTER_FORM_FILL:
      return {
        ...state,
        registerForm: updateRegisterFormData(createFormGroupState<RegisterFormData>(REGISTER_FORM, action.formData), {
          type: ''
        })
      };

    default:
      return state;
  }
}

/* Reset Password Form */

const RESET_PASSWORD_FORM = 'reset_password_form';
const RESET_PASSWORD_FORM_RESET = 'reset_password_form_reset';
const RESET_PASSWORD_FORM_FILL = 'reset_password_form_fill';

export interface ResetPasswordFormData {
  password: string;
  passwordConfirmation: string;
}

const initResetPasswordForm = createFormGroupState<ResetPasswordFormData>(RESET_PASSWORD_FORM, {
  password: '',
  passwordConfirmation: ''
});

const updateResetPasswordFormData = groupUpdateReducer<ResetPasswordFormData>({
  password: validate(required),
  passwordConfirmation: passwordConfirmationValidation
});

export interface ResetPasswordFormState {
  resetPasswordForm: FormGroupState<ResetPasswordFormData>;
}

const initResetPasswordState: ResetPasswordFormState = {
  resetPasswordForm: initResetPasswordForm
};

export interface ResetPasswordFormAction extends Action {
  formData?: ResetPasswordFormData;
}

export class ResetResetPasswordFormAction implements ResetPasswordFormAction {
  public readonly type = RESET_PASSWORD_FORM_RESET;
}

export class FillResetPasswordFormAction implements ResetPasswordFormAction {
  public readonly type = RESET_PASSWORD_FORM_FILL;
  public formData: ResetPasswordFormData;

  constructor(fd: ResetPasswordFormData) {
    this.formData = fd;
  }
}

export function resetPasswordFormReducer(state = initResetPasswordState, action: ResetPasswordFormAction) {
  const resetPasswordForm = updateResetPasswordFormData(state.resetPasswordForm, action);

  if (resetPasswordForm !== state.resetPasswordForm) {
    state = { ...state, resetPasswordForm } as any;
  }

  switch (action.type) {
    case RESET_PASSWORD_FORM_RESET:
      return {
        ...state,
        forgotPasswordForm: initResetPasswordForm
      };
    case RESET_PASSWORD_FORM_FILL:
      return {
        ...state,
        forgotPasswordForm: updateResetPasswordFormData(
          createFormGroupState<ResetPasswordFormData>(RESET_PASSWORD_FORM, action.formData),
          { type: '' }
        )
      };

    default:
      return state;
  }
}

/* User Form */

const USER_FORM = 'user_form';
const USER_FORM_RESET = 'user_form_reset';
const USER_FORM_FILL = 'user_form_fill';

export interface UserFormData {
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  firstName: string;
  lastName: string;
  password: string;
  passwordConfirmation: string;
}

const initUserForm = createFormGroupState<UserFormData>(USER_FORM, {
  username: '',
  email: '',
  role: '',
  isActive: false,
  firstName: '',
  lastName: '',
  password: '',
  passwordConfirmation: ''
});

const updateUserFormData = groupUpdateReducer<UserFormData>({
  username: validate(required),
  email: validate(required),
  role: validate(required),
  firstName: validate(required),
  lastName: validate(required),
  password: validate(required),
  passwordConfirmation: passwordConfirmationValidation
});

export interface UserFormState {
  userForm: FormGroupState<UserFormData>;
}

const initUserState: UserFormState = {
  userForm: initUserForm
};

export interface UserFormAction extends Action {
  formData?: UserFormData;
}

export class ResetUserFormAction implements UserFormAction {
  public readonly type = USER_FORM_RESET;
}

export class FillUserFormAction implements UserFormAction {
  public readonly type = USER_FORM_FILL;
  public formData: UserFormData;

  constructor(fd: UserFormData) {
    this.formData = fd;
  }
}

export function userFormReducer(state = initUserState, action: UserFormAction) {
  const userForm = updateUserFormData(state.userForm, action);

  if (userForm !== state.userForm) {
    state = { ...state, userForm } as any;
  }

  switch (action.type) {
    case USER_FORM_RESET:
      return {
        ...state,
        userForm: initUserForm
      };
    case USER_FORM_FILL:
      return {
        ...state,
        userForm: updateUserFormData(createFormGroupState<UserFormData>(USER_FORM, action.formData), action)
      };

    default:
      return state;
  }
}
