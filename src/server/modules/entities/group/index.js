// import { camelizeKeys, decamelizeKeys, decamelize } from 'humps';
import { camelizeKeys } from 'humps';
import { has } from 'lodash';

import knex from '../../../../server/sql/connector';

export default class Group {
  async getGroups(orderBy, filter) {
    const queryBuilder = knex
      .select('g.uuid as id', 'g.created_at', 'g.updated_at', 'g.is_active', 'g.name')
      .from('groups AS g');

    if (has(filter, 'isActive') && filter.isActive !== null) {
      queryBuilder.where(function() {
        this.where('u.is_active', filter.isActive);
      });
    }

    return camelizeKeys(await queryBuilder);
  }

  async getGroup(id) {
    return camelizeKeys(
      await knex
        .select('g.uuid as id', 'g.created_at', 'g.updated_at', 'g.is_active', 'g.name')
        .from('groups AS g')
        .where('g.uuid', '=', id)
        .first()
    );
  }
}
