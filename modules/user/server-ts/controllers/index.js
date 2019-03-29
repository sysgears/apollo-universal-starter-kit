import getUsersController from './getUsers';
import addUserController from './addUser';

const restApi = [
  { route: '/getUsers', controller: getUsersController, method: 'GET' },
  { route: '/addUser', controller: addUserController, method: 'POST' }
];

export default restApi;
