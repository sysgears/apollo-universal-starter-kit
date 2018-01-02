import _ from 'lodash';
import { camelizeKeys } from 'humps';

import { orderedFor } from '../../../stores/sql/knex/helpers/batching';

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

/*eslint-disable no-unused-vars*/

export default class Org {
  /*
   * Basic functions
   */

  list = listAdapter({ table: 'orgs', selects: ['*', 'id AS org_id'] });
  paging = pagingAdapter({ table: 'orgs', selects: ['*', 'id AS org_id'] });
  getMany = listAdapter({ table: 'orgs', selects: ['*', 'id AS org_id'] });
  get = getAdapter({ table: 'orgs', selects: ['*', 'id AS org_id'] });
  getByName = getAdapter({ table: 'orgs', idField: 'name', selects: ['*', 'id AS org_id'] });

  create = createWithIdGenAdapter({ table: 'orgs' });
  update = updateAdapter({ table: 'orgs' });
  delete = deleteAdapter({ table: 'orgs' });

  getProfile = getAdapter({ table: 'org_profile', idField: 'org_id' });
  getProfileMany = listAdapter({ table: 'org_profile', idField: 'org_id' });
  createProfile = createWithIdAdapter({ table: 'org_profile', idField: 'org_id' });
  updateProfile = updateAdapter({ table: 'org_profile', idField: 'org_id' });
  deleteProfile = deleteAdapter({ table: 'org_profile', idField: 'org_id' });

  getSettings = getAdapter({ table: 'org_settings', idField: 'org_id' });
  getSettingsMany = listAdapter({ table: 'org_settings', idField: 'org_id' });
  createSettings = createWithIdAdapter({ table: 'org_settings', idField: 'org_id' });
  updateSettings = updateAdapter({ table: 'org_settings', idField: 'org_id' });
  deleteSettings = deleteAdapter({ table: 'org_settings', idField: 'org_id' });

  /*
   * Membership functions
   */

  addUserToOrg = createWithoutIdAdapter({ table: 'orgs_users' });
  removeUserFromOrg = deleteAdapter({ table: 'orgs_users', idField: 'user_id' });

  addGroupToOrg = createWithoutIdAdapter({ table: 'orgs_groups' });
  removeGroupFromOrg = deleteAdapter({ table: 'orgs_groups', idField: 'group_id' });

  getUserIdsForOrgIds = getManyRelationAdapter({
    table: 'orgs_users',
    elemField: 'user_id',
    collectionField: 'org_id'
  });

  getOrgIdsForUserIds = getManyRelationAdapter({
    table: 'orgs_users',
    elemField: 'org_id',
    collectionField: 'user_id'
  });

  getGroupIdsForOrgIds = getManyRelationAdapter({
    table: 'orgs_groups',
    elemField: 'group_id',
    collectionField: 'org_id'
  });

  getOrgIdsForGroupIds = getManyRelationAdapter({
    table: 'orgs_groups',
    elemField: 'org_id',
    collectionField: 'group_id'
  });

  getUserIdsForOrgIdsViaGroups = async (args, trx) => {
    let ret1 = await getUserIdsForOrgIdsSelector(args, trx);
    let ret2 = await getUserIdsForOrgIdsViaGroupsSelector(args, trx);
    let ret = ret1.concat(ret2);
    // console.log("users4orgs - ret", ret)

    ret = _.filter(ret, r => r.user_id !== null);
    // console.log("users4orgs - post filter", ret)
    // incase no ids were provided, which means we want everything
    if (!args.ids) {
      args.ids = _.uniq(_.map(ret, r => r.org_id));
    }
    // console.log("users4orgs", args)
    ret = camelizeKeys(ret);
    ret = orderedFor(ret, args.ids, 'orgId', false);
    // console.log("users4orgs", ret)
    return ret;
  };

  getOrgIdsForUserIdsViaGroups = async (args, trx) => {
    let ret1 = await getOrgIdsForUserIdsSelector(args, trx);
    let ret2 = await getOrgIdsForUserIdsViaGroupsSelector(args, trx);
    let ret = ret1.concat(ret2);
    // console.log("orgs4users", ret)

    ret = _.filter(ret, r => r.org_id !== null);
    // incase no ids were provided, which means we want everything
    if (!args.ids) {
      args.ids = _.uniq(_.map(ret, r => r.user_id));
    }
    ret = camelizeKeys(ret);
    ret = orderedFor(ret, args.ids, 'userId', false);
    return ret;
  };

  search = async (args, trx) => {
    const ret = await searchOrgsSelector(args, trx);
    return ret;
  };
}

const searchOrgsSelector = pagingAdapter({
  table: 'orgs',
  filters: [
    {
      bool: 'or',
      table: 'orgs',
      field: 'id',
      compare: 'like',
      valueExtractor: args => `${args.searchText}`
    },
    {
      bool: 'or',
      table: 'orgs',
      field: 'name',
      compare: 'like',
      valueExtractor: args => `${args.searchText}`
    },
    {
      bool: 'or',
      table: 'orgs',
      field: 'url_name',
      compare: 'like',
      valueExtractor: args => `${args.searchText}`
    },
    {
      bool: 'or',
      table: 'orgs',
      field: 'display_name',
      compare: 'like',
      valueExtractor: args => `${args.searchText}`
    },
    {
      bool: 'or',
      table: 'orgs',
      field: 'locale',
      compare: 'like',
      valueExtractor: args => `${args.searchText}`
    }
  ]
});

const getOrgIdsForUserIdsSelector = selectAdapter({
  table: 'orgs_users',
  filters: [
    {
      applyWhen: args => args.ids,
      field: 'user_id',
      compare: 'in',
      valuesExtractor: args => args.ids
    }
  ]
});

const getOrgIdsForUserIdsViaGroupsSelector = selectAdapter({
  table: 'orgs_groups',
  joins: [
    {
      table: 'groups_users',
      join: 'left',
      args: ['orgs_groups.group_id', 'groups_users.group_id']
    }
  ],
  filters: [
    {
      applyWhen: args => args.ids,
      table: 'groups_users',
      field: 'user_id',
      compare: 'in',
      valuesExtractor: args => args.ids
    }
  ]
});

const getUserIdsForOrgIdsSelector = selectAdapter({
  table: 'orgs_users',
  filters: [
    {
      applyWhen: args => args.ids,
      field: 'org_id',
      compare: 'in',
      valuesExtractor: args => args.ids
    }
  ]
});

const getUserIdsForOrgIdsViaGroupsSelector = selectAdapter({
  table: 'groups_users',
  joins: [
    {
      table: 'orgs_groups',
      join: 'left',
      args: ['groups_users.group_id', 'orgs_groups.group_id']
    }
  ],
  filters: [
    {
      applyWhen: args => args.ids,
      table: 'orgs_groups',
      field: 'org_id',
      compare: 'in',
      valuesExtractor: args => args.ids
    }
  ]
});
