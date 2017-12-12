import { camelizeKeys, decamelizeKeys, decamelize } from 'humps';
import { has, _ } from 'lodash';
import uuidv4 from 'uuid';

import knex from '../../../../server/sql/connector';
import { orderedFor } from '../../../../server/sql/helpers';

export default class Group {
  async list(args) {
    let { filters, orderBys, offset, limit } = args;

    const queryBuilder = knex
      .select(
        'g.uuid as id',
        'g.created_at',
        'g.updated_at',
        'g.is_active',
        'g.name',
        'p.display_name',
        'p.description'
      )
      .from('groups AS g')
      .leftJoin('group_profile AS p', 'p.group_id', 'g.id');

    // add filter conditions
    if (filters) {
      for (let filter of filters) {
        if (has(filter, 'isActive') && filter.isActive !== null) {
          queryBuilder.where(function() {
            this.where('g.is_active', filter.isActive);
          });
        }

        if (has(filter, 'searchText') && filter.searchText !== '') {
          queryBuilder.where(function() {
            this.where('g.name', 'like', `%${filter.searchText}%`)
              .orWhere('p.display_name', 'like', `%${filter.searchText}%`)
              .orWhere('p.description', 'like', `%${filter.searchText}%`);
          });
        }
      }
    }

    if (offset) {
      queryBuilder.offset(offset);
    }

    if (limit) {
      queryBuilder.limit(limit);
    }

    // add order by
    if (orderBys) {
      for (let orderBy of orderBys) {
        if (orderBy && orderBy.column) {
          let column = orderBy.column;
          let order = 'asc';
          if (orderBy.order) {
            order = orderBy.order;
          }
          queryBuilder.orderBy(decamelize(column), order);
        }
      }
    }

    return camelizeKeys(await queryBuilder);
  }

  async get(id) {
    return camelizeKeys(
      await knex
        .select(
          'g.uuid as id',
          'g.created_at',
          'g.updated_at',
          'g.is_active',
          'g.name',
          'p.display_name',
          'p.description'
        )
        .from('groups AS g')
        .where('g.uuid', '=', id)
        .first()
    );
  }

  async getOrgsForGroupId(groupId) {
    let rows = await knex
      .select('o.uuid AS id', 'o.name', 'g.uuid AS groupId')
      .whereIn('g.uuid', groupId)
      .from('groups AS g')
      .leftJoin('orgs_groups AS og', 'og.group_id', 'g.id')
      .leftJoin('orgs AS o', 'o.id', 'og.org_id');

    let res = _.filter(rows, row => row.id !== null);
    return orderedFor(res, groupId, 'groupId', false);
  }

  async getUsersForGroupId(groupId) {
    let rows = await knex
      .select('u.uuid AS id', 'u.email', 'g.uuid AS groupId')
      .whereIn('g.uuid', groupId)
      .from('groups AS g')
      .leftJoin('groups_users AS gu', 'gu.group_id', 'g.id')
      .leftJoin('users AS u', 'u.id', 'gu.user_id');

    let res = _.filter(rows, row => row.id !== null);
    return orderedFor(res, groupId, 'groupId', false);
  }

  async getServiceAccountsForGroupId(groupId) {
    let rows = await knex
      .select('sa.uuid AS id', 'sa.email', 'g.uuid AS groupId')
      .whereIn('g.uuid', groupId)
      .from('groups AS g')
      .leftJoin('groups_serviceaccounts AS gs', 'gs.group_id', 'g.id')
      .leftJoin('serviceaccounts AS sa', 'sa.id', 'gs.serviceaccount_id');

    let res = _.filter(rows, row => row.id !== null);
    return orderedFor(res, groupId, 'groupId', false);
  }

  async create(values) {
    values.uuid = uuidv4();
    const [uid] = await knex('groups')
      .returning('uuid')
      .insert(decamelizeKeys(values));
    return uid;
  }

  async getInternalIdFromUUID(uuid) {
    return knex
      .select('id')
      .from('groups')
      .where('uuid', '=', uuid)
      .first();
  }

  async update(uuid, values) {
    return knex('groups')
      .where('uuid', '=', uuid)
      .update(decamelizeKeys(values));
  }

  async delete(uuid) {
    return knex('groups')
      .where('uuid', '=', uuid)
      .delete();
  }

  async getProfile(uuid) {
    return knex
      .select('p')
      .join('groups AS q')
      .where('q.uuid', '=', uuid)
      .leftJoin('group_profile AS p', 'p.group_id', 'q.id')
      .first();
  }

  async createProfile(uuid, values) {
    let groupId = await this.getInternalIdFromUUID(uuid);
    values.groupId = groupId;
    return knex('group_profile').insert(decamelizeKeys(values));
  }

  async updateProfile(uuid, values) {
    let groupId = await this.getInternalIdFromUUID(uuid);
    return knex('group_profile')
      .where('group_id', '=', groupId)
      .update(decamelizeKeys(values));
  }

  async deleteProfile(uuid) {
    let groupId = await this.getInternalIdFromUUID(uuid);
    return knex('group_profile')
      .where('group_id', '=', groupId)
      .delete();
  }
}
