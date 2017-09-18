import knex from '../../../server/sql/connector';

export default class Count {
  getCount() {
    return knex('count').first();
  }

  addCount(amount: number) {
    return knex('count').increment('amount', amount);
  }
}
