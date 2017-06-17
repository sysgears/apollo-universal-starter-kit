import knex from '../../sql/connector';

export default class Count {
  getCount() {
    return knex('count').first();
  }

  addCount(amount) {
    return knex('count')
      .increment('amount', amount);
  }
}
