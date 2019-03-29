import getUsersController from './getUsers';
import addUserController from './addUser';
import editUserController from './editUser';

const restApi = [
  { route: '/getUsers', controller: getUsersController, method: 'GET' },
  { route: '/addUser', controller: addUserController, method: 'POST' },
  { route: '/editUser', controller: editUserController, method: 'PUT' }
];

export default restApi;
