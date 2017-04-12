import knex from './connector';

export default class Count {
  getCount() {
    return knex('count').first();
  }

  addCount(amount) {
    return knex('count')
      .increment('amount', amount);
  }
}
