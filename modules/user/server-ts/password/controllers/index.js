import registerController from './register';
import loginController from './login';

const restApi = [
  { route: '/register', controller: registerController, method: 'POST' },
  { route: '/login', controller: loginController, method: 'POST' }
];

export default restApi;
