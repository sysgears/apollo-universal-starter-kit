import registerController from './register';

const restApi = [{ route: '/register', controller: registerController, method: 'POST' }];

export default restApi;
