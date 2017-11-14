import {
  forgotPasswordFormReducer,
  loginFormReducer,
  reducer,
  registerFormReducer,
  resetPasswordFormReducer
} from './reducers';

import Feature from '../connector';
import ForgotPasswordView from './components/ForgotPasswordView.web';
import LoginView from './components/LoginView.web';
import ProfileView from './components/ProfileView.web';
import RegisterView from './components/RegisterView.web';
import ResetPasswordView from './components/ResetPasswordView.web';
import UsersEditView from './components/UserEditView';
import Users from './components/Users.web';

const tokenMiddleware = (req: any, options: any) => {
  options.headers['x-token'] = window.localStorage.getItem('token');
  options.headers['x-refresh-token'] = window.localStorage.getItem('refreshToken');
};

const tokenAfterware = (res: any, options: any) => {
  const token = options.headers['x-token'];
  const refreshToken = options.headers['x-refresh-token'];
  if (token) {
    window.localStorage.setItem('token', token);
  }
  if (refreshToken) {
    window.localStorage.setItem('refreshToken', refreshToken);
  }
};

const connectionParam = () => {
  return {
    token: window.localStorage.getItem('token'),
    refreshToken: window.localStorage.getItem('refreshToken')
  };
};

export default new Feature({
  route: [
    { path: 'login', component: LoginView, data: { title: 'Login' } },
    { path: 'profile', component: ProfileView, data: { title: 'Profile' } },
    { path: 'register', component: RegisterView, data: { title: 'Register' } },
    { path: 'users', component: Users, data: { title: 'Users' } },
    { path: 'users/:id', component: UsersEditView, data: { title: 'Edit User' } },
    { path: 'forgot-password', component: ForgotPasswordView, data: { title: 'Forgot Password' } },
    { path: 'reset-password/:token', component: ResetPasswordView, data: { title: 'Reset Password' } }
  ],
  navItem: [`<auth-nav [role]="'admin'"></auth-nav>`],
  navItemRight: [`<auth-login></auth-login>`],
  reducer: {
    user: reducer,
    loginForm: loginFormReducer,
    forgotPasswordForm: forgotPasswordFormReducer,
    registerForm: registerFormReducer,
    resetPasswordForm: resetPasswordFormReducer
  },
  middleware: tokenMiddleware,
  afterware: tokenAfterware,
  connectionParam
});
