// import { camelizeKeys, decamelizeKeys, decamelize } from 'humps';
import { camelizeKeys } from 'humps';
import { has } from 'lodash';

import knex from '../../../../server/sql/connector';

export default class ServiceAccount {
  async getServiceAccounts(orderBy, filter) {
    const queryBuilder = knex
      .select('s.uuid as id', 's.created_at', 's.updated_at', 's.is_active', 's.email')
      .from('serviceaccounts AS s');

    if (has(filter, 'isActive') && filter.isActive !== null) {
      queryBuilder.where(function() {
        this.where('u.is_active', filter.isActive);
      });
    }

    return camelizeKeys(await queryBuilder);
  }

  async getServiceAccount(id) {
    return camelizeKeys(
      await knex
        .select('s.uuid as id', 's.created_at', 's.updated_at', 's.is_active', 's.email')
        .from('serviceaccounts AS s')
        .where('s.uuid', '=', id)
        .first()
    );
  }
}
