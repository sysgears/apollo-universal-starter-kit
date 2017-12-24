import _ from 'lodash';
import { camelizeKeys } from 'humps';

import knex from '../../../sql/connector';
import { orderedFor } from '../../../sql/helpers';

import log from '../../../../common/log';

import {
  createAdapter,
  listAdapter,
  getAdapter,
  updateAdapter,
  deleteAdapter,
  getManyRelationAdapter,
  createRelationAdapter,
  deleteRelationAdapter
} from '../../../sql/crud';

export default class Org {
  /*
   * Basic functions
   */

  list = listAdapter('orgs', { selects: ['*', 'id AS orgId'] });
  getMany = listAdapter('orgs', { selects: ['*', 'id AS orgId'] });
  get = getAdapter('orgs', { selects: ['*', 'id AS orgId'] });
  getByName = getAdapter('orgs', { idField: 'name', selects: ['*', 'id AS orgId'] });

  create = createAdapter('orgs');
  update = updateAdapter('orgs');
  delete = deleteAdapter('orgs');

  getProfile = getAdapter('org_profile', { idField: 'orgId' });
  getProfileMany = listAdapter('org_profile', { idField: 'orgId' });
  createProfile = createAdapter('org_profile', { idField: 'orgId' });
  updateProfile = updateAdapter('org_profile', { idField: 'orgId' });
  deleteProfile = deleteAdapter('org_profile', { idField: 'orgId' });

  /*
   * Membership functions
   */

  addUserToOrg = createRelationAdapter('orgs_users', { elemField: 'userId', collectionField: 'orgId' });
  removeUserFromOrg = deleteRelationAdapter('orgs_users', { elemField: 'userId', collectionField: 'orgId' });

  addGroupToOrg = createRelationAdapter('orgs_groups', { elemField: 'groupId', collectionField: 'orgId' });
  removeGroupFromOrg = deleteRelationAdapter('orgs_groups', { elemField: 'groupId', collectionField: 'orgId' });

  getUserIdsForOrgIds = getManyRelationAdapter('orgs_users', { elemField: 'userId', collectionField: 'orgId' });
  getOrgIdsForUserIds = getManyRelationAdapter('orgs_users', { elemField: 'orgId', collectionField: 'userId' });

  getGroupIdsForOrgIds = getManyRelationAdapter('orgs_groups', { elemField: 'groupId', collectionField: 'orgId' });
  getOrgIdsForGroupIds = getManyRelationAdapter('orgs_groups', { elemField: 'orgId', collectionField: 'groupId' });

  async getUserIdsForOrgIdsViaGroups(ids, trx) {
    try {
      let builder1 = knex
        .select('*')
        .whereIn('og.org_id', ids)
        .from('orgs_users AS og');

      if (trx) {
        builder1.transacting(trx);
      }

      let rows1 = await builder1;
      let builder = knex
        .select('ou.org_id', 'gu.group_id', 'ou.user_id')
        .whereIn('ou.org_id', ids)
        .from('orgs_users AS ou')
        .leftJoin('groups_users AS gu', 'gu.user_id', 'ou.user_id');

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;
      rows = rows.concat(rows1);

      let ret = _.filter(rows, row => row.userId !== null);
      ret = camelizeKeys(ret);
      ret = orderedFor(ret, ids, 'orgId', false);
      return ret;
    } catch (e) {
      log.error('Error in Org.getUserIdsForOrgIdsViaGroups', e);
      throw e;
    }
  }

  async getOrgIdsForUserIdsViaGroups(ids, trx) {
    try {
      let builder1 = knex
        .select('*')
        .whereIn('og.user_id', ids)
        .from('orgs_users AS og');

      if (trx) {
        builder1.transacting(trx);
      }

      let rows1 = await builder1;

      let builder = knex
        .select('og.org_id', 'gu.group_id', 'gu.user_id')
        .whereIn('gu.user_id', ids)
        .from('groups_users AS gu')
        .leftJoin('orgs_groups AS og', 'og.group_id', 'gu.group_id');

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;
      rows = rows.concat(rows1);
      let ret = _.filter(rows, row => row.orgId !== null);
      let res = camelizeKeys(ret);
      res = orderedFor(res, ids, 'userId', false);
      return res;
    } catch (e) {
      log.error('Error in Org.getOrgIdsForUserIdsViaGroups', e);
      throw e;
    }
  }
}
