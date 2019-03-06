import knex from '../../../packages/server/src/sql/connector';

export default class Counter {
  public counterQuery() {
    return knex('counter').first();
  }

  public addCounter(amount: number) {
    return knex('counter').increment('amount', amount);
  }
}
