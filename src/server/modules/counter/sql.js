import knex from '../../stores/sql/knex/client';

export default class Counter {
  counterQuery() {
    return knex('counter').first();
  }

  addCounter(amount) {
    return knex('counter').increment('amount', amount);
  }
}
