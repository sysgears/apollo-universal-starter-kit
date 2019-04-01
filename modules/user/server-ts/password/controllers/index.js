import registerController from './register';
import loginController from './login';
import forgotPasswordController from './forgotPassword';
import resetPasswordController from './resetPassword';

const restApi = [
  { route: '/register', controller: registerController, method: 'POST' },
  { route: '/login', controller: loginController, method: 'POST' },
  { route: '/forgotPassword', controller: forgotPasswordController, method: 'POST' },
  { route: '/resetPassword', controller: resetPasswordController, method: 'POST' }
];

export default restApi;
