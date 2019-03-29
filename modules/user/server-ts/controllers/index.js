import getUsersController from './getUsers';

const restApi = [{ route: '/getUsers', controller: getUsersController, method: 'GET' }];

export default restApi;
