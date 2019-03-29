import getUsersController from './getUsers';
import addUserController from './addUser';
import editUserController from './editUser';
import deleteUserController from './deleteUser';

const restApi = [
  { route: '/getUsers', controller: getUsersController, method: 'GET' },
  { route: '/addUser', controller: addUserController, method: 'POST' },
  { route: '/editUser', controller: editUserController, method: 'PUT' },
  { route: '/deleteUser', controller: deleteUserController, method: 'DELETE' }
];

export default restApi;
