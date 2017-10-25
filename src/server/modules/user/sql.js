// Helpers
import { camelizeKeys, decamelize } from 'humps';
import { has } from 'lodash';
import bcrypt from 'bcryptjs';
import knex from '../../../server/sql/connector';

// Actual query fetching and transformation in DB
export default class User {
  async getUsers(orderBy, filter) {
    const queryBuilder = knex
      .select('u.id as id', 'u.username', 'u.is_admin', 'u.is_active', 'u.email', 'up.first_name', 'up.last_name')
      .from('user AS u')
      .leftJoin('user_profile AS up', 'up.user_id', 'u.id');

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
      if (has(filter, 'isAdmin') && filter.isAdmin !== null) {
        queryBuilder.where(function() {
          this.where('is_admin', filter.isAdmin);
        });
      }

      if (has(filter, 'isActive') && filter.isActive !== null) {
        queryBuilder.where(function() {
          this.where('is_active', filter.isActive);
        });
      }

      if (has(filter, 'searchText') && filter.searchText !== '') {
        queryBuilder.where(function() {
          this.where('username', 'like', `%${filter.searchText}%`).orWhere('email', 'like', `%${filter.searchText}%`);
        });
      }
    }

    return camelizeKeys(await queryBuilder);
  }

  async getUser(id) {
    return camelizeKeys(
      await knex
        .select(
          'u.id',
          'u.username',
          'u.is_admin',
          'u.is_active',
          'u.email',
          'up.first_name',
          'up.last_name',
          'ca.serial',
          'fa.fb_id',
          'fa.display_name'
        )
        .from('user AS u')
        .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
        .leftJoin('auth_certificate AS ca', 'ca.user_id', 'u.id')
        .leftJoin('auth_facebook AS fa', 'fa.user_id', 'u.id')
        .where('u.id', '=', id)
        .first()
    );
  }

  async getUserWithPassword(id) {
    return camelizeKeys(
      await knex
        .select('u.id', 'u.username', 'u.is_admin', 'u.is_active', 'u.password')
        .from('user AS u')
        .where('u.id', '=', id)
        .first()
    );
  }

  async getUserWithSerial(serial) {
    return camelizeKeys(
      await knex
        .select('u.id', 'u.username', 'u.is_admin', 'u.is_active', 'ca.serial')
        .from('user AS u')
        .leftJoin('auth_certificate AS ca', 'ca.user_id', 'u.id')
        .where('ca.serial', '=', serial)
        .first()
    );
  }

  async register({ username, email, password, isActive }) {
    const passwordHashed = await bcrypt.hash(password, 12);

    return knex('user')
      .insert({ username, email, password: passwordHashed, is_active: !!isActive })
      .returning('id');
  }

  createFacebookOuth({ id, displayName, userId }) {
    return knex('auth_facebook')
      .insert({ fb_id: id, display_name: displayName, user_id: userId })
      .returning('id');
  }

  async editUser({ id, username, email, isAdmin, isActive, password }) {
    let localAuthInput = { email };
    if (password) {
      const passwordHashed = await bcrypt.hash(password, 12);
      localAuthInput = { email, password: passwordHashed };
    }

    return knex('user')
      .update({
        username: username,
        is_admin: isAdmin,
        is_active: isActive,
        ...localAuthInput
      })
      .where({ id });
  }

  deleteUser(id) {
    return knex('user')
      .where('id', '=', id)
      .del();
  }

  async updatePassword(id, newPassword) {
    const password = await bcrypt.hash(newPassword, 12);

    return knex('user')
      .update({ password })
      .where({ id });
  }

  updateActive(id, isActive) {
    return knex('user')
      .update({ is_active: isActive })
      .where({ id });
  }

  async getUserByEmail(email) {
    return camelizeKeys(
      await knex
        .select('*')
        .from('user')
        .where({ email })
        .first()
    );
  }

  async getUserByFbIdOrEmail(id, email) {
    return camelizeKeys(
      await knex
        .select('u.id', 'u.username', 'u.is_admin', 'u.is_active', 'fa.fb_id', 'la.email', 'la.password')
        .from('user AS u')
        .leftJoin('auth_local AS la', 'la.user_id', 'u.id')
        .leftJoin('auth_facebook AS fa', 'fa.user_id', 'u.id')
        .where('fa.fb_id', '=', id)
        .orWhere('la.email', '=', email)
        .first()
    );
  }

  async getUserByUsername(username) {
    return camelizeKeys(
      await knex
        .select('*')
        .from('user AS u')
        .where('u.username', '=', username)
        .first()
    );
  }
}
