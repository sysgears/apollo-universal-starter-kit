// Helpers
import { camelizeKeys } from 'humps';
import knex from '../../../server/sql/connector';

// Actual query fetching and transformation in DB
export default class User {
  async getUsers() {
    return camelizeKeys(await knex.select('*').from('user'));
  }

  async getUser(id) {
    return camelizeKeys(await knex.select('*').from('user').where({ id }).first());
  }

  async getUserByEmail(email) {
    return camelizeKeys(await knex.select('*').from('user').where({ email }).first());
  }

  register({ username, email, password, isAdmin }) {
    if(!isAdmin) {
      isAdmin = false;
    }

    return knex('user').insert({ username, email, password, is_admin: isAdmin }).returning('id');
  }
}
