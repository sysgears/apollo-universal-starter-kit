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

  async createSubscription({ userId, stripeCustomerId, expiryMonth, expiryYear, last4, brand }) {
    return await knex('subscription')
      .insert({
        user_id: userId,
        stripe_customer_id: stripeCustomerId,
        expiry_month: expiryMonth,
        expiry_year: expiryYear,
        last4,
        brand,
        active: false
      })
      .returning('id');
  }

  async toggleSubscription({ userId, active }) {
    return await knex('subscription')
      .update({ active })
      .where({ user_id: userId });
  }
}
