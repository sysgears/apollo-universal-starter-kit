import { camelizeKeys, decamelizeKeys } from 'humps';
import { _ } from 'lodash';
import uuidv4 from 'uuid';

import log from '../../../../../common/log';
import knex from '../../../../sql/connector';

import paging from '../../../../sql/paging';
import ordering from '../../../../sql/ordering';
import filterBuilder from '../../../../sql/filters';
import joinBuilder from '../../../../sql/joins';
import { orderedFor } from '../../../../sql/helpers';

const selectFields = [
  'o.id AS org_id',
  'o.is_active',
  'o.created_at',
  'o.updated_at',
  'o.name',

  'p.created_at',
  'p.updated_at',
  'p.domain',
  'p.display_name',
  'p.description'
];

export default class Org {
  async getFlex(args, trx) {
    try {
      let builder = knex.select('*', 'o.id AS orgId').from('orgs AS o');

      // add filter conditions
      builder = joinBuilder(builder, args);

      // add filter conditions
      builder = filterBuilder(builder, args);

      // paging and ordering
      builder = paging(builder, args);
      builder = ordering(builder, args);

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return camelizeKeys(ret);
    } catch (e) {
      log.error('Error in Org.getFlex', e);
      throw e;
    }
  }
  async list(args, trx) {
    try {
      let builder = knex
        .select(...selectFields)
        .from('orgs AS o')
        .leftJoin('org_profile AS p', 'p.org_id', 'o.id');

      // add filter conditions
      builder = filterBuilder(builder, args);

      // paging and ordering
      builder = paging(builder, args);
      builder = ordering(builder, args);

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;
      return camelizeKeys(rows);
    } catch (e) {
      log.error('Error in Org.list', e);
      throw e;
    }
  }

  async get(id, trx) {
    // console.log("Org.get", id)
    try {
      let builder = knex
        .select(...selectFields)
        .from('orgs AS o')
        .where('o.id', '=', id)
        .leftJoin('org_profile AS p', 'p.org_id', 'o.id')
        .first();

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return camelizeKeys(ret);
    } catch (e) {
      log.error('Error in Org.get', e);
      throw e;
    }
  }

  async getMany(args, trx) {
    try {
      let builder = knex
        .select(...selectFields)
        .from('orgs AS o')
        .whereIn('o.id', args.ids)
        .leftJoin('org_profile AS p', 'p.org_id', 'o.id');

      // add filter conditions
      builder = filterBuilder(builder, args);

      // paging and ordering
      builder = paging(builder, args);
      builder = ordering(builder, args);

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return camelizeKeys(ret);
    } catch (e) {
      log.error('Error in Org.getMany', e);
      throw e;
    }
  }

  async getByName(name, trx) {
    // console.log("Org.get", id)
    try {
      let builder = knex
        .select(...selectFields)
        .from('orgs AS o')
        .where('o.name', '=', name)
        .leftJoin('org_profile AS p', 'p.org_id', 'o.id')
        .first();

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return camelizeKeys(ret);
    } catch (e) {
      log.error('Error in Org.get', e);
      throw e;
    }
  }

  async create(values) {
    try {
      values.id = uuidv4();
      await knex('orgs').insert(decamelizeKeys(values));
      return values.id;
    } catch (e) {
      log.error('Error in Org.create', e);
      throw e;
    }
  }

  async update(id, values) {
    try {
      return knex('orgs')
        .where('id', '=', id)
        .update(decamelizeKeys(values));
    } catch (e) {
      log.error('Error in Org.update', e);
      throw e;
    }
  }

  async delete(id) {
    try {
      return knex('orgs')
        .where('id', '=', id)
        .delete();
    } catch (e) {
      log.error('Error in Org.delete', e);
      throw e;
    }
  }

  async getProfile(id, trx) {
    try {
      let builder = knex
        .select('*')
        .from('org_profile')
        .where('org_id', '=', id)
        .first();

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return camelizeKeys(ret);
    } catch (e) {
      log.error('Error in Org.getProfile', e);
      throw e;
    }
  }

  async getProfileMany(args, trx) {
    try {
      let builder = knex
        .select('*')
        .from('org_profile')
        .whereIn('org_id', args.ids);

      // add filter conditions
      builder = filterBuilder(builder, args);

      // paging and ordering
      builder = paging(builder, args);
      builder = ordering(builder, args);

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return camelizeKeys(ret);
    } catch (e) {
      log.error('Error in Org.getProfileMany', e);
      throw e;
    }
  }

  async createProfile(id, values) {
    try {
      values.orgId = id;
      return knex('org_profile').insert(decamelizeKeys(values));
    } catch (e) {
      log.error('Error in Org.createProfile', e);
      throw e;
    }
  }

  async updateProfile(id, values) {
    try {
      return knex('org_profile')
        .where('org_id', '=', id)
        .update(decamelizeKeys(values));
    } catch (e) {
      log.error('Error in Org.updateProfile', e);
      throw e;
    }
  }

  async deleteProfile(id) {
    try {
      return knex('org_profile')
        .where('org_id', '=', id)
        .delete();
    } catch (e) {
      log.error('Error in Org.deleteProfile', e);
      throw e;
    }
  }

  /*
   *
   * Membership functions
   *
   */

  async addUserToOrg(orgId, userId, trx) {
    try {
      let builder = knex('orgs_users').insert({
        org_id: orgId,
        user_id: userId
      });

      if (trx) {
        builder.transacting(trx);
      }

      return await builder;
    } catch (e) {
      log.error('Error in Org.addUserToOrg', e);
      throw e;
    }
  }

  async removeUserFromOrg(orgId, userId, trx) {
    try {
      let builder = knex('orgs_users')
        .where('org_id', '=', orgId)
        .andWhere('user_id', '=', userId)
        .delete();

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return ret;
    } catch (e) {
      log.error('Error in Org.removeUserFromOrg', e);
      throw e;
    }
  }

  async addGroupToOrg(orgId, groupId, trx) {
    try {
      let builder = knex('orgs_groups').insert({
        org_id: orgId,
        group_id: groupId
      });

      if (trx) {
        builder.transacting(trx);
      }

      return await builder;
    } catch (e) {
      log.error('Error in Org.addGroupToOrg', e);
      throw e;
    }
  }

  async removeGroupFromOrg(orgId, groupId, trx) {
    try {
      let builder = knex('orgs_groups')
        .where('org_id', '=', orgId)
        .andWhere('group_id', '=', groupId)
        .delete();

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return ret;
    } catch (e) {
      log.error('Error in Org.removeGroupFromOrg', e);
      throw e;
    }
  }

  /*
   *
   * Loader functions
   *
   */

  async getUserIdsForOrgIds(ids, trx) {
    try {
      let builder = knex
        .select('*')
        .from('orgs_users')
        .whereIn('user_id', ids);

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;

      let ret = _.filter(rows, row => row.userId !== null);
      ret = camelizeKeys(ret);
      ret = orderedFor(ret, ids, 'orgId', false);
      return ret;
    } catch (e) {
      log.error('Error in Org.getUserIdsForOrgIds', e);
      throw e;
    }
  }

  async getUserIdsForOrgIdsViaGroups(ids, trx) {
    try {
      let builder = knex
        .select('ou.org_id', 'gu.group_id', 'ou.user_id')
        .whereIn('ou.org_id', ids)
        .from('orgs_users AS ou')
        .leftJoin('groups_users AS gu', 'gu.user_id', 'ou.user_id');

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;

      let ret = _.filter(rows, row => row.userId !== null);
      ret = camelizeKeys(ret);
      ret = orderedFor(ret, ids, 'orgId', false);
      return ret;
    } catch (e) {
      log.error('Error in Org.getUserIdsForOrgIdsViaGroups', e);
      throw e;
    }
  }

  async getOrgIdsForUserIds(ids, trx) {
    try {
      let builder = knex
        .select('*')
        .from('orgs_users')
        .whereIn('user_id', ids);

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;

      let ret = _.filter(rows, row => row.orgId !== null);
      ret = camelizeKeys(ret);
      ret = orderedFor(ret, ids, 'userId', false);
      return ret;
    } catch (e) {
      log.error('Error in Org.getOrgIdsForUserIds', e);
      throw e;
    }
  }

  async getOrgIdsForUserIdsViaGroups(ids, trx) {
    try {
      let builder = knex
        .select('og.org_id', 'gu.group_id', 'gu.user_id')
        .whereIn('gu.user_id', ids)
        .from('groups_users AS gu')
        .leftJoin('orgs_groups AS og', 'og.group_id', 'gu.group_id');

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;
      let ret = _.filter(rows, row => row.orgId !== null);
      let res = camelizeKeys(ret);
      res = orderedFor(res, ids, 'userId', false);
      return res;
    } catch (e) {
      log.error('Error in Org.getOrgIdsForUserIdsViaGroups', e);
      throw e;
    }
  }

  async getGroupIdsForOrgIds(ids, trx) {
    try {
      let builder = knex
        .select('*')
        .from('orgs_groups')
        .whereIn('org_id', ids);

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;

      let ret = _.filter(rows, row => row.groupId !== null);
      ret = camelizeKeys(ret);
      ret = orderedFor(ret, ids, 'orgId', false);
      return ret;
    } catch (e) {
      log.error('Error in Org.getGroupIdsForOrgIds', e);
      throw e;
    }
  }

  async getOrgIdsForGroupIds(ids, trx) {
    try {
      let builder = knex
        .select('*')
        .from('orgs_groups')
        .whereIn('group_id', ids);

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;

      let ret = _.filter(rows, row => row.orgId !== null);
      ret = camelizeKeys(ret);
      ret = orderedFor(ret, ids, 'groupId', false);
      return ret;
    } catch (e) {
      log.error('Error in Org.getOrgIdsForGroupIds', e);
      throw e;
    }
  }

  async getServiceAccountIdsForOrgIds(ids, trx) {
    try {
      let builder = knex
        .select('*')
        .from('orgs_serviceaccounts')
        .whereIn('serviceaccount_id', ids);

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;

      let ret = _.filter(rows, row => row.serviceaccountId !== null);
      ret = camelizeKeys(ret);
      ret = orderedFor(ret, ids, 'orgId', false);
      return ret;
    } catch (e) {
      log.error('Error in Org.getServiceAccountIdsForOrgIds', e);
      throw e;
    }
  }

  async getServiceAccountIdsForOrgIdsViaGroups(ids, trx) {
    try {
      let builder = knex
        .select('ou.org_id', 'gu.group_id', 'ou.serviceaccount_id')
        .whereIn('ou.org_id', ids)
        .from('orgs_serviceaccounts AS ou')
        .leftJoin('groups_serviceaccounts AS gu', 'gu.serviceaccount_id', 'ou.serviceaccount_id');

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;

      let ret = _.filter(rows, row => row.serviceaccountId !== null);
      ret = camelizeKeys(ret);
      ret = orderedFor(ret, ids, 'orgId', false);
      return ret;
    } catch (e) {
      log.error('Error in Org.getServiceAccountIdsForOrgIdsViaGroups', e);
      throw e;
    }
  }

  async getOrgIdsForServiceAccountIds(ids, trx) {
    try {
      let builder = knex
        .select('*')
        .from('orgs_serviceaccounts')
        .whereIn('serviceaccount_id', ids);

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;

      let ret = _.filter(rows, row => row.orgId !== null);
      ret = camelizeKeys(ret);
      ret = orderedFor(ret, ids, 'serviceaccountId', false);
      return ret;
    } catch (e) {
      log.error('Error in Org.getOrgIdsForServiceAccountIds', e);
      throw e;
    }
  }

  async getOrgIdsForServiceAccountIdsViaGroups(ids, trx) {
    try {
      let builder = knex
        .select('og.org_id', 'gu.group_id', 'gu.serviceaccount_id')
        .whereIn('gu.serviceaccount_id', ids)
        .from('groups_serviceaccounts AS gu')
        .leftJoin('orgs_groups AS og', 'og.group_id', 'gu.group_id');

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;
      let ret = _.filter(rows, row => row.orgId !== null);
      let res = camelizeKeys(ret);
      res = orderedFor(res, ids, 'serviceaccountId', false);
      return res;
    } catch (e) {
      log.error('Error in Org.getOrgIdsForServiceAccountIdsViaGroups', e);
      throw e;
    }
  }
}
