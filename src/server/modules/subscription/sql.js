// Helpers
import knex from '../../../server/sql/connector';

// Actual query fetching and transformation in DB
export default class Subscription {
  getSubscription(userId) {
    return knex('subscription')
      .select('s.active')
      .from('subscription as s')
      .where('s.user_id', '=', userId)
      .first();
  }
}
