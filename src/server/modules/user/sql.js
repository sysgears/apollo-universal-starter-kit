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
        .leftJoin('local_auth AS la', 'la.user_id', 'u.id')
    );
  }

  async getUser(id) {
    return camelizeKeys(
      await knex
        .select('u.id', 'u.username', 'u.is_admin', 'la.email')
        .from('user AS u')
        .leftJoin('local_auth AS la', 'la.user_id', 'u.id')
        .where('u.id', '=', id)
        .first()
    );
  }

  async getUserWithPassword(id) {
    return camelizeKeys(
      await knex
        .select('u.id', 'u.username', 'u.is_admin', 'la.password')
        .from('user AS u')
        .leftJoin('local_auth AS la', 'la.user_id', 'u.id')
        .where('u.id', '=', id)
        .first()
    );
  }

  async getUserWithSerial(serial) {
    return camelizeKeys(
      await knex
        .select('u.id', 'u.username', 'u.is_admin')
        .from('user AS u')
        .leftJoin('cert_auth AS ca', 'ca.user_id', 'u.id')
        .where('ca.serial', '=', serial)
        .first()
    );
  }

  register({ username }) {
    return knex('user')
      .insert({ username })
      .returning('id');
  }

  createLocalOuth({ email, password, userId }) {
    return knex('local_auth')
      .insert({ email, password, user_id: userId })
      .returning('id');
  }

  UpdatePassword(id, password) {
    return knex('local_auth')
      .update({ password })
      .where({ user_id: id });
  }

  async getLocalOuth(id) {
    return camelizeKeys(
      await knex
        .select('*')
        .from('local_auth')
        .where({ id })
        .first()
    );
  }

  async getLocalOuthByEmail(email) {
    return camelizeKeys(
      await knex
        .select('*')
        .from('local_auth')
        .where({ email })
        .first()
    );
  }
}
