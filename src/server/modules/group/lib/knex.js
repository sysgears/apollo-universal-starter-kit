import {
  createAdapter,
  listAdapter,
  getAdapter,
  updateAdapter,
  deleteAdapter,
  getManyRelationAdapter,
  createRelationAdapter,
  deleteRelationAdapter
} from '../../../stores/sql/knex/helpers/crud';

export default class Group {
  /*
   * Basic functions
   */

  list = listAdapter('groups', { selects: ['*', 'id AS groupId'] });
  getMany = listAdapter('groups', { selects: ['*', 'id AS groupId'] });
  get = getAdapter('groups', { selects: ['*', 'id AS groupId'] });
  getByName = getAdapter('groups', { idField: 'name', selects: ['*', 'id AS groupId'] });

  create = createAdapter('groups');
  update = updateAdapter('groups');
  delete = deleteAdapter('groups');

  /*
   * Profile functions
   */

  getProfile = getAdapter('group_profile', { idField: 'groupId' });
  getProfileMany = listAdapter('group_profile', { idField: 'groupId' });
  createProfile = createAdapter('group_profile', { idField: 'groupId' });
  updateProfile = updateAdapter('group_profile', { idField: 'groupId' });
  deleteProfile = deleteAdapter('group_profile', { idField: 'groupId' });

  /*
   * Membership functions
   */

  addUserToGroup = createRelationAdapter('groups_users', { elemField: 'userId', collectionField: 'groupId' });
  removeUserFromGroup = deleteRelationAdapter('groups_users', { elemField: 'userId', collectionField: 'groupId' });

  getGroupIdsForUserIds = getManyRelationAdapter('groups_users', { elemField: 'groupId', collectionField: 'userId' });
  getUserIdsForGroupIds = getManyRelationAdapter('groups_users', { elemField: 'userId', collectionField: 'groupId' });
}
