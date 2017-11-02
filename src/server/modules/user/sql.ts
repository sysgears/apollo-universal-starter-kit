// Helpers
import * as bcrypt from 'bcryptjs';
import { camelizeKeys, decamelize } from 'humps';
import { has } from 'lodash';
import knex from '../../../server/sql/connector';

// Actual query fetching and transformation in DB
export default class User {
  public async getUsers(orderBy, filter) {
    const queryBuilder = knex
      .select('u.id as id', 'u.username', 'u.is_admin', 'u.is_active', 'la.email')
      .from('user AS u')
      .leftJoin('auth_local AS la', 'la.user_id', 'u.id');

    // add order by
    if (orderBy && orderBy.column) {
      const column = orderBy.column;
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

  public async getUser(id: number) {
    return camelizeKeys(
      await knex
        .select('u.id', 'u.username', 'u.is_admin', 'u.is_active', 'la.email')
        .from('user AS u')
        .leftJoin('auth_local AS la', 'la.user_id', 'u.id')
        .where('u.id', '=', id)
        .first()
    );
  }

  public async getUserWithPassword(id: number) {
    return camelizeKeys(
      await knex
        .select('u.id', 'u.username', 'u.is_admin', 'u.is_active', 'la.password')
        .from('user AS u')
        .leftJoin('auth_local AS la', 'la.user_id', 'u.id')
        .where('u.id', '=', id)
        .first()
    );
  }

  public async getUserWithSerial(serial: any) {
    return camelizeKeys(
      await knex
        .select('u.id', 'u.username', 'u.is_admin')
        .from('user AS u')
        .leftJoin('auth_certificate AS ca', 'ca.user_id', 'u.id')
        .where('ca.serial', '=', serial)
        .first()
    );
  }

  public register({ username, isActive }) {
    return knex('user')
      .insert({ username, is_active: !!isActive })
      .returning('id');
  }

  public async createLocalOuth({ email, password, userId }) {
    const passwordHashed = await bcrypt.hash(password, 12);

    return knex('auth_local')
      .insert({ email, password: passwordHashed, user_id: userId })
      .returning('id');
  }

  public createFacebookOuth({ id, displayName, userId }: any) {
    return knex('auth_facebook')
      .insert({ fb_id: id, display_name: displayName, user_id: userId })
      .returning('id');
  }

  public async editUser({ id, username, email, isAdmin, isActive, password }) {
    const userPromise = knex('user')
      .update({
        username,
        is_admin: isAdmin,
        is_active: isActive
      })
      .where({ id });

    let localAuthInput = { email };
    if (password) {
      const passwordHashed = await bcrypt.hash(password, 12);
      localAuthInput = { email, password: passwordHashed };
    }

    const localAuth = knex('auth_local')
      .update({ ...localAuthInput })
      .where({ user_id: id });

    return Promise.all([userPromise, localAuth]);
  }

  public deleteUser(id) {
    return knex('user')
      .where('id', '=', id)
      .del();
  }

  public async updatePassword(id, newPassword) {
    const password = await bcrypt.hash(newPassword, 12);

    return knex('auth_local')
      .update({ password })
      .where({ user_id: id });
  }

  public updateActive(id: number, isActive: boolean) {
    return knex('user')
      .update({ is_active: isActive })
      .where({ id });
  }

  public async getLocalOuth(id: number) {
    return camelizeKeys(
      await knex
        .select('*')
        .from('auth_local')
        .where({ id })
        .first()
    );
  }

  public async getLocalOuthByEmail(email: string) {
    return camelizeKeys(
      await knex
        .select('*')
        .from('auth_local')
        .where({ email })
        .first()
    );
  }

  public async getUserByFbIdOrEmail(id: number, email: string) {
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

  public async getUserByUsername(username) {
    return camelizeKeys(
      await knex
        .select('u.id', 'u.username', 'u.is_admin', 'u.is_active')
        .from('user AS u')
        .where('u.username', '=', username)
        .first()
    );
  }

  public async getUserByUsername(username) {
    return camelizeKeys(
      await knex
        .select('u.id', 'u.username', 'u.is_admin', 'u.is_active')
        .from('user AS u')
        .where('u.username', '=', username)
        .first()
    );
  }
}
