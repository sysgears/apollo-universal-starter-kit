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
  'g.id AS group_id',
  'g.is_active',
  'g.created_at',
  'g.updated_at',
  'g.name',

  'p.created_at',
  'p.updated_at',
  'p.display_name',
  'p.description'
];

export default class Group {
  async getFlex(args, trx) {
    try {
      let builder = knex.select('*', 'g.id AS groupId').from('groups AS g');

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
      log.error('Error in Group.getFlex', e);
      throw e;
    }
  }

  async list(args, trx) {
    try {
      let builder = knex
        .select(...selectFields)
        .from('groups AS g')
        .leftJoin('group_profile AS p', 'p.group_id', 'g.id');

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
      log.error('Error in Group.list', e);
      throw e;
    }
  }

  async get(id, trx) {
    try {
      let builder = knex
        .select(...selectFields)
        .from('groups AS g')
        .where('g.id', '=', id)
        .leftJoin('group_profile AS p', 'p.group_id', 'g.id')
        .first();

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return camelizeKeys(ret);
    } catch (e) {
      log.error('Error in Group.get', e);
      throw e;
    }
  }

  async getMany(args, trx) {
    try {
      let builder = knex
        .select(...selectFields)
        .from('groups AS g')
        .whereIn('g.id', args.ids)
        .leftJoin('group_profile AS p', 'p.group_id', 'g.id');

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
      log.error('Error in Group.get', e);
      throw e;
    }
  }

  async getByName(name, trx) {
    try {
      let builder = knex
        .select(...selectFields)
        .from('groups AS g')
        .where('g.name', '=', name)
        .leftJoin('group_profile AS p', 'p.group_id', 'g.id')
        .first();

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return camelizeKeys(ret);
    } catch (e) {
      log.error('Error in Group.get', e);
      throw e;
    }
  }

  async create(values, trx) {
    try {
      values.id = uuidv4();
      let builder = knex('groups').insert(decamelizeKeys(values));

      if (trx) {
        builder.transacting(trx);
      }

      await builder;
      return values.id;
    } catch (e) {
      log.error('Error in Group.create', e);
      throw e;
    }
  }

  async update(id, values, trx) {
    try {
      let builder = knex('groups')
        .where('id', '=', id)
        .update(decamelizeKeys(values));

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return ret;
    } catch (e) {
      log.error('Error in Group.update', e);
      throw e;
    }
  }

  async delete(id, trx) {
    try {
      let builder = knex('groups')
        .where('id', '=', id)
        .delete();

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return ret;
    } catch (e) {
      log.error('Error in Group.delete', e);
      throw e;
    }
  }

  async getProfile(id, trx) {
    try {
      let builder = knex
        .select('*')
        .from('group_profile')
        .where('group_id', '=', id)
        .first();

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return camelizeKeys(ret);
    } catch (e) {
      log.error('Error in Group.getProfile', e);
      throw e;
    }
  }

  async getProfileMany(args, trx) {
    try {
      let builder = knex
        .select('*')
        .from('group_profile')
        .whereIn('group_id', args.ids);

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
      log.error('Error in Group.getProfileMany', e);
      throw e;
    }
  }

  async createProfile(id, values, trx) {
    try {
      values.groupId = id;
      let builder = knex('group_profile').insert(decamelizeKeys(values));

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return ret;
    } catch (e) {
      log.error('Error in Group.createProfile', e);
      throw e;
    }
  }

  async updateProfile(id, values, trx) {
    try {
      let builder = knex('group_profile')
        .where('group_id', '=', id)
        .update(decamelizeKeys(values));

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return ret;
    } catch (e) {
      log.error('Error in Group.updateProfile', e);
      throw e;
    }
  }

  async deleteProfile(id, trx) {
    try {
      let builder = knex('group_profile')
        .where('group_id', '=', id)
        .delete();

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return ret;
    } catch (e) {
      log.error('Error in Group.deleteProfile', e);
      throw e;
    }
  }

  /*
   *
   * Membership functions
   *
   */

  async addUserToGroup(groupId, userId, trx) {
    try {
      let builder = knex('groups_users').insert({
        group_id: groupId,
        user_id: userId
      });

      if (trx) {
        builder.transacting(trx);
      }

      return await builder;
    } catch (e) {
      log.error('Error in Group.create', e);
      throw e;
    }
  }

  async removeUserFromGroup(groupId, userId, trx) {
    try {
      let builder = knex('groups_users')
        .where('group_id', '=', groupId)
        .andWhere('user_id', '=', userId)
        .delete();

      if (trx) {
        builder.transacting(trx);
      }

      let ret = await builder;
      return ret;
    } catch (e) {
      log.error('Error in Group.deleteProfile', e);
      throw e;
    }
  }

  /*
   *
   *  Loaders
   *
   */

  async getGroupIdsForUserIds(ids, trx) {
    try {
      let builder = knex
        .select('*')
        .from('groups_users')
        .whereIn('user_id', ids);

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;

      let ret = _.filter(rows, row => row.groupId !== null);
      ret = camelizeKeys(ret);
      ret = orderedFor(ret, ids, 'userId', false);
      return ret;
    } catch (e) {
      log.error('Error in User.getGroupsIdsForUserId', e);
      throw e;
    }
  }

  async getUserIdsForGroupIds(ids, trx) {
    try {
      let builder = knex
        .select('*')
        .from('groups_users')
        .whereIn('group_id', ids);

      if (trx) {
        builder.transacting(trx);
      }

      let rows = await builder;

      let ret = _.filter(rows, row => row.userId !== null);
      ret = camelizeKeys(ret);
      ret = orderedFor(ret, ids, 'groupId', false);
      return ret;
    } catch (e) {
      log.error('Error in Group.getUserIdsForGroupIds', e);
      throw e;
    }
  }
}
