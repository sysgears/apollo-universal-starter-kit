// Helpers
import knex from '../../../server/sql/connector';

// Actual query fetching and transformation in DB
export default class User {
  getUsers() {
    return knex.select('*').from('user');
  }

  getUser(id) {
    return knex.select('*').from('user').where({ id }).first();
  }

  register({ username, email, password }) {
    return knex('user').insert({ username, email, password }).returning('id');
  }
}
