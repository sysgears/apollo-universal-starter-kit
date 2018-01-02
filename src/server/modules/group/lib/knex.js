/*eslint-disable no-unused-vars*/
import _ from 'lodash';
// import { camelizeKeys } from 'humps';

import {
  getAdapter,
  listAdapter,
  pagingAdapter,
  createWithIdGenAdapter,
  createWithIdAdapter,
  createWithoutIdAdapter,
  updateAdapter,
  deleteAdapter,
  getManyRelationAdapter
} from '../../../stores/sql/knex/helpers/crud';

import selectAdapter from '../../../stores/sql/knex/helpers/select';
// import { orderedFor } from '../../../stores/sql/knex/helpers/batching';

export default class Group {
  /*
   * Basic functions
   */

  list = listAdapter({ table: 'groups', selects: ['*', 'id AS group_id'] });
  paging = pagingAdapter({ table: 'groups', selects: ['*', 'id AS group_id'] });
  getMany = listAdapter({ table: 'groups', selects: ['*', 'id AS group_id'] });
  get = getAdapter({ table: 'groups', selects: ['*', 'id AS group_id'] });
  getByName = getAdapter({ table: 'groups', idField: 'name', selects: ['*', 'id AS group_id'] });

  create = createWithIdGenAdapter({ table: 'groups' });
  update = updateAdapter({ table: 'groups' });
  delete = deleteAdapter({ table: 'groups' });

  /*
   * Profile functions
   */

  getProfile = getAdapter({ table: 'group_profile', idField: 'group_id' });
  getProfileMany = listAdapter({ table: 'group_profile', idField: 'group_id' });
  createProfile = createWithIdAdapter({ table: 'group_profile', idField: 'group_id' });
  updateProfile = updateAdapter({ table: 'group_profile', idField: 'group_id' });
  deleteProfile = deleteAdapter({ table: 'group_profile', idField: 'group_id' });

  getSettings = getAdapter({ table: 'group_settings', idField: 'group_id' });
  getSettingsMany = listAdapter({ table: 'group_settings', idField: 'group_id' });
  createSettings = createWithIdAdapter({ table: 'group_settings', idField: 'group_id' });
  updateSettings = updateAdapter({ table: 'group_settings', idField: 'group_id' });
  deleteSettings = deleteAdapter({ table: 'group_settings', idField: 'group_id' });

  /*
   * Membership functions
   */

  addUserToGroup = createWithoutIdAdapter({ table: 'groups_users' });
  removeUserFromGroup = deleteAdapter({ table: 'groups_users', idField: 'user_id' });

  getGroupIdsForUserIds = getManyRelationAdapter({
    table: 'groups_users',
    elemField: 'group_id',
    collectionField: 'user_id'
  });

  getUserIdsForGroupIds = getManyRelationAdapter({
    table: 'groups_users',
    elemField: 'user_id',
    collectionField: 'group_id'
  });

  search = async (args, trx) => {
    const ret = await searchGroupsSelector(args, trx);
    return ret;
  };
}

const searchGroupsSelector = pagingAdapter({
  table: 'groups',
  filters: [
    {
      bool: 'or',
      table: 'groups',
      field: 'id',
      compare: 'like',
      valueExtractor: args => `${args.searchText}`
    },
    {
      bool: 'or',
      table: 'groups',
      field: 'name',
      compare: 'like',
      valueExtractor: args => `${args.searchText}`
    },
    {
      bool: 'or',
      table: 'groups',
      field: 'url_name',
      compare: 'like',
      valueExtractor: args => `${args.searchText}`
    },
    {
      bool: 'or',
      table: 'groups',
      field: 'display_name',
      compare: 'like',
      valueExtractor: args => `${args.searchText}`
    },
    {
      bool: 'or',
      table: 'groups',
      field: 'locale',
      compare: 'like',
      valueExtractor: args => `${args.searchText}`
    }
  ]
});
