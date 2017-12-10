// import { camelizeKeys, decamelizeKeys, decamelize } from 'humps';
import { camelizeKeys } from 'humps';
import { has } from 'lodash';

import knex from '../../../../server/sql/connector';

export default class Org {
  async getOrgs(orderBy, filter) {
    const queryBuilder = knex
      .select('o.uuid as id', 'o.is_active', 'o.created_at', 'o.updated_at', 'o.name', 'o.domain')
      .from('orgs AS o');

    if (has(filter, 'isActive') && filter.isActive !== null) {
      queryBuilder.where(function() {
        this.where('u.is_active', filter.isActive);
      });
    }

    return camelizeKeys(await queryBuilder);
  }

  async getOrg(id) {
    return camelizeKeys(
      await knex
        .select('o.uuid as id', 'o.is_active', 'o.created_at', 'o.updated_at', 'o.name', 'o.domain')
        .from('orgs AS o')
        .where('o.uuid', '=', id)
        .first()
    );
  }
}
