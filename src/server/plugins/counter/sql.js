import knex from '../../../server/sql/connection';

export default class Counter {
  counterQuery() {
    return knex('counter').first();
  }

  addCounter(amount) {
    return knex('counter').increment('amount', amount);
  }
}
