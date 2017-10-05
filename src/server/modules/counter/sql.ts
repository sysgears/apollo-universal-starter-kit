import knex from '../../../server/sql/connector';

export default class Count {
  public getCount() {
    return knex('count').first();
  }

  public addCount(amount: number) {
    return knex('count').increment('amount', amount);
  }
}
