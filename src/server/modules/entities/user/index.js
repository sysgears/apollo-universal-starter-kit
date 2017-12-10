// import { camelizeKeys, decamelizeKeys, decamelize } from 'humps';
import { camelizeKeys } from 'humps';
import { has } from 'lodash';

import knex from '../../../../server/sql/connector';

export default class User {
  async getUsers(orderBy, filter) {
    const queryBuilder = knex
      .select('u.uuid as id', 'u.created_at', 'u.updated_at', 'u.is_active', 'u.email')
      .from('users AS u');

    if (has(filter, 'isActive') && filter.isActive !== null) {
      queryBuilder.where(function() {
        this.where('u.is_active', filter.isActive);
      });
    }

    /*
      .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
      .leftJoin('auth_certificate AS ca', 'ca.user_id', 'u.id')
      .leftJoin('auth_facebook AS fa', 'fa.user_id', 'u.id')
      .leftJoin('auth_google AS ga', 'ga.user_id', 'u.id');

    // add order by
    if (orderBy && orderBy.column) {
      let column = orderBy.column;
      let order = 'asc';
      if (orderBy.order) {
        order = orderBy.order;
      }

      queryBuilder.orderBy(decamelize(column), order);
    }

    // add filter conditions
    if (filter) {
      if (has(filter, 'role') && filter.role !== '') {
        queryBuilder.where(function() {
          this.where('u.role', filter.role);
        });
      }

      if (has(filter, 'isActive') && filter.isActive !== null) {
        queryBuilder.where(function() {
          this.where('u.is_active', filter.isActive);
        });
      }

      if (has(filter, 'searchText') && filter.searchText !== '') {
        queryBuilder.where(function() {
          this.where('u.username', 'like', `%${filter.searchText}%`)
            .orWhere('u.email', 'like', `%${filter.searchText}%`)
            .orWhere('up.first_name', 'like', `%${filter.searchText}%`)
            .orWhere('up.last_name', 'like', `%${filter.searchText}%`);
        });
      }
    }
    */

    return camelizeKeys(await queryBuilder);
  }

  async getUser(id) {
    return camelizeKeys(
      await knex
        .select('u.uuid as id', 'u.created_at', 'u.updated_at', 'u.is_active', 'u.email')
        .from('users AS u')
        .where('u.uuid', '=', id)
        .first()
      /*
        .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
        .leftJoin('auth_certificate AS ca', 'ca.user_id', 'u.id')
        .leftJoin('auth_facebook AS fa', 'fa.user_id', 'u.id')
        .leftJoin('auth_google AS ga', 'ga.user_id', 'u.id')
        */
    );
  }
}
