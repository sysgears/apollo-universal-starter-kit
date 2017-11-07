// Helpers
import { camelizeKeys } from 'humps';
import knex from '../../../server/sql/connector';

// Actual query fetching and transformation in DB
export default class Subscription {
  async getSubscription(userId) {
    return camelizeKeys(
      await knex('subscription')
        .select('s.*')
        .from('subscription as s')
        .where('s.user_id', '=', userId)
        .first()
    );
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

  async deleteSubscription({ userId }) {
    return await knex('subscription')
      .where({ user_id: userId })
      .del();
  }

  async updateSubscription({ userId, active, stripeSubscriptionId }) {
    return await knex('subscription')
      .update({
        active,
        stripe_subscription_id: stripeSubscriptionId
      })
      .where({ user_id: userId })
      .returning('active');
  }

  async getCardInfo(userId) {
    return camelizeKeys(
      await knex('subscription')
        .select('s.expiry_month', 's.expiry_year', 's.last4', 's.brand')
        .from('subscription as s')
        .where('s.user_id', '=', userId)
        .first()
    );
  }
}
