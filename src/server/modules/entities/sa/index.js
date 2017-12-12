import { camelizeKeys, decamelizeKeys, decamelize } from 'humps';
import { has, _ } from 'lodash';
import uuidv4 from 'uuid';

import knex from '../../../../server/sql/connector';
import { orderedFor } from '../../../../server/sql/helpers';

export default class ServiceAccount {
  async list(args) {
    let { filters, orderBys, offset, limit } = args;

    const queryBuilder = knex
      .select(
        's.uuid as id',
        's.created_at',
        's.updated_at',
        's.is_active',
        's.email',
        'p.display_name',
        'p.description'
      )
      .from('serviceaccounts AS s')
      .leftJoin('serviceaccount_profile AS p', 'p.serviceaccount_id', 's.id');

    // add filter conditions
    if (filters) {
      for (let filter of filters) {
        if (has(filter, 'isActive') && filter.isActive !== null) {
          queryBuilder.where(function() {
            this.where('s.is_active', filter.isActive);
          });
        }

        if (has(filter, 'searchText') && filter.searchText !== '') {
          queryBuilder.where(function() {
            this.where('s.email', 'like', `%${filter.searchText}%`)
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
          's.uuid as id',
          's.created_at',
          's.updated_at',
          's.is_active',
          's.email',
          'p.display_name',
          'p.description'
        )
        .from('serviceaccounts AS s')
        .where('s.uuid', '=', id)
        .leftJoin('serviceaccount_profile AS p', 'p.serviceaccount_id', 's.id')
        .first()
    );
  }

  async getOrgsForServiceAccountId(saId) {
    let rows = await knex
      .select('o.uuid AS id', 'o.name', 'sa.uuid AS saId')
      .whereIn('sa.uuid', saId)
      .from('serviceaccounts AS sa')
      .leftJoin('orgs_serviceaccounts AS os', 'os.serviceaccount_id', 'sa.id')
      .leftJoin('orgs AS o', 'o.id', 'os.org_id');

    let res = _.filter(rows, row => row.id !== null);
    return orderedFor(res, saId, 'saId', false);
  }
  async getOrgsForServiceAccountIdViaGroups(saId) {
    let rows = await knex
      .select('o.uuid AS id', 'o.name', 'sa.uuid AS saId')
      .whereIn('sa.uuid', saId)
      .from('serviceaccounts AS sa')
      .leftJoin('groups_serviceaccounts AS gu', 'gu.serviceaccount_id', 'sa.id')
      .leftJoin('orgs_groups AS og', 'og.group_id', 'gu.group_id')
      .leftJoin('orgs AS o', 'o.id', 'og.group_id');

    let res = _.filter(rows, row => row.id !== null);
    return orderedFor(res, saId, 'saId', false);
  }
  async getGroupsForServiceAccountId(saId) {
    let rows = await knex
      .select('g.uuid AS id', 'g.name', 'sa.uuid AS saId')
      .whereIn('sa.uuid', saId)
      .from('serviceaccounts AS sa')
      .leftJoin('groups_serviceaccounts AS gu', 'gu.serviceaccount_id', 'sa.id')
      .leftJoin('groups AS g', 'gu.group_id', 'g.id');

    let res = _.filter(rows, row => row.id !== null);
    return orderedFor(res, saId, 'saId', false);
  }

  async create(values) {
    values.uuid = uuidv4();
    const [uid] = await knex('serviceaccounts')
      .returning('uuid')
      .insert(decamelizeKeys(values));
    return uid;
  }

  async getInternalIdFromUUID(uuid) {
    return knex
      .select('id')
      .from('serviceaccounts')
      .where('uuid', '=', uuid)
      .first();
  }

  async update(uuid, values) {
    return knex('serviceaccounts')
      .where('uuid', '=', uuid)
      .update(decamelizeKeys(values));
  }

  async delete(uuid) {
    return knex('serviceaccounts')
      .where('uuid', '=', uuid)
      .delete();
  }

  async getProfile(uuid) {
    return knex
      .select('p')
      .join('serviceaccounts AS q')
      .where('q.uuid', '=', uuid)
      .leftJoin('serviceaccount_profile AS p', 'p.serviceaccount_id', 'q.id')
      .first();
  }

  async createProfile(uuid, values) {
    let serviceaccountId = await this.getInternalIdFromUUID(uuid);
    values.serviceaccountId = serviceaccountId;
    return knex('serviceaccount_profile').insert(decamelizeKeys(values));
  }

  async updateProfile(uuid, values) {
    let serviceaccountId = await this.getInternalIdFromUUID(uuid);
    return knex('serviceaccount_profile')
      .where('serviceaccount_id', '=', serviceaccountId)
      .update(decamelizeKeys(values));
  }

  async deleteProfile(uuid) {
    let serviceaccountId = await this.getInternalIdFromUUID(uuid);
    return knex('serviceaccount_profile')
      .where('serviceaccount_id', '=', serviceaccountId)
      .delete();
  }
}
