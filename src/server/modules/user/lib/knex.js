import {
  createAdapter,
  listAdapter,
  getAdapter,
  updateAdapter,
  deleteAdapter
} from '../../../stores/sql/knex/helpers/crud';

export default class User {
  list = listAdapter('users', { selects: ['*', 'id AS userId'] });
  getMany = listAdapter('users', { selects: ['*', 'id AS userId'] });
  get = getAdapter('users', { selects: ['*', 'id AS userId'] });
  getByName = getAdapter('users', { idField: 'name', selects: ['*', 'id AS userId'] });

  create = createAdapter('users');
  update = updateAdapter('users');
  delete = deleteAdapter('users');

  getProfile = getAdapter('user_profile', { idField: 'userId' });
  getProfileMany = listAdapter('user_profile', { idField: 'userId' });
  createProfile = createAdapter('user_profile', { idField: 'userId' });
  updateProfile = updateAdapter('user_profile', { idField: 'userId' });
  deleteProfile = deleteAdapter('user_profile', { idField: 'userId' });
}
