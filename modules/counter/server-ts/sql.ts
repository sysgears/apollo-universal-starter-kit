import { knex } from '@gqlapp/database-server-ts';

export default class Counter {
  public counterQuery() {
    return knex('counter').first();
  }

  public addCounter(amount: number) {
    return knex('counter').increment('amount', amount);
  }
}
