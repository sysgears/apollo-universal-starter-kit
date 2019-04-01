import registerController from './register';
import loginController from './login';
import forgotPasswordController from './forgotPassword';

const restApi = [
  { route: '/register', controller: registerController, method: 'POST' },
  { route: '/login', controller: loginController, method: 'POST' },
  { route: '/forgotPassword', controller: forgotPasswordController, method: 'POST' }
];

export default restApi;
