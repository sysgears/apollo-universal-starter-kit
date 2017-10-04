// Helpers
import { camelizeKeys } from 'humps';
import knex from '../../../server/sql/connector';

// Actual query fetching and transformation in DB
export default class User {
  async getUsers() {
    return camelizeKeys(
      await knex
        .select('u.id', 'u.username', 'u.is_admin', 'la.email')
        .from('user AS u')
        .leftJoin('auth_local AS la', 'la.user_id', 'u.id')
    );
  }

  async getUser(id) {
    return camelizeKeys(
      await knex
        .select('u.id', 'u.username', 'u.is_admin', 'la.email')
        .from('user AS u')
        .leftJoin('auth_local AS la', 'la.user_id', 'u.id')
        .where('u.id', '=', id)
        .first()
    );
  }

  async getUserWithPassword(id) {
    return camelizeKeys(
      await knex
        .select('u.id', 'u.username', 'u.is_admin', 'u.is_active', 'la.password')
        .from('user AS u')
        .leftJoin('auth_local AS la', 'la.user_id', 'u.id')
        .where('u.id', '=', id)
        .first()
    );
  }

  async getUserWithSerial(serial) {
    return camelizeKeys(
      await knex
        .select('u.id', 'u.username', 'u.is_admin')
        .from('user AS u')
        .leftJoin('auth_certificate AS ca', 'ca.user_id', 'u.id')
        .where('ca.serial', '=', serial)
        .first()
    );
  }

  register({ username, isActive }) {
    return knex('user')
      .insert({ username, is_active: isActive })
      .returning('id');
  }

  createLocalOuth({ email, password, userId }) {
    return knex('auth_local')
      .insert({ email, password, user_id: userId })
      .returning('id');
  }

  createFacebookOuth({ id, displayName, userId }) {
    console.log(userId);

    return knex('auth_facebook')
      .insert({ fb_id: id, display_name: displayName, user_id: userId })
      .returning('id');
  }

  UpdatePassword(id, password) {
    return knex('auth_local')
      .update({ password })
      .where({ user_id: id });
  }

  updateActive(id, isActive) {
    return knex('user')
      .update({ is_active: isActive })
      .where({ id });
  }

  async getLocalOuth(id) {
    return camelizeKeys(
      await knex
        .select('*')
        .from('auth_local')
        .where({ id })
        .first()
    );
  }

  async getLocalOuthByEmail(email) {
    return camelizeKeys(
      await knex
        .select('*')
        .from('auth_local')
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
}
