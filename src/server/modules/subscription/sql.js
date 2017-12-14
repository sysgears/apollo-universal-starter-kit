// Helpers
import { camelizeKeys, decamelizeKeys } from 'humps';
import knex from '../../../server/sql/connector';

import UserDAO from '../entities/user';

let User = new UserDAO();

// Actual query fetching and transformation in DB
export default class Subscription {
  async getSubscription(userId) {
    if (!userId) {
      return null;
    }
    let ret = camelizeKeys(
      await knex
        .select('s.*')
        .from('users AS u')
        .where('u.uuid', '=', userId)
        .leftJoin('user_subscriptions AS s', 's.user_id', 'u.id')
        .first()
    );
    if (!ret || ret.id === null) {
      return null;
    }
    return ret;
  }

  async getSubscriptionByStripeSubscriptionId(stripeSubscriptionId) {
    let ret = camelizeKeys(
      await knex
        .select('s.*')
        .from('user_subscriptions as s')
        .where('s.stripe_subscription_id', '=', stripeSubscriptionId)
        .first()
    );
    if (!ret || ret.user_id === null) {
      return null;
    }
    return ret;
  }

  async getSubscriptionByStripeCustomerId(stripeCustomerId) {
    let ret = camelizeKeys(
      await knex
        .select('s.*')
        .from('user_subscriptions as s')
        .where('s.stripe_customer_id', '=', stripeCustomerId)
        .first()
    );
    if (!ret || ret.user_id === null) {
      return null;
    }
    return ret;
  }

  async editSubscription({ userUUID, subscription }) {
    let userId = await User.getInternalIdFromUUID(userUUID);
    const userSubscription = await knex('user_subscriptions')
      .select('id')
      .where({ user_id: userId })
      .first();

    if (userSubscription) {
      return await knex('user_subscriptions')
        .update(decamelizeKeys(subscription))
        .where({ user_id: userId })
        .returning('id');
    } else {
      return await knex('user_subscriptions')
        .insert({ ...decamelizeKeys(subscription), user_id: userId })
        .returning('id');
    }
  }

  async getCardInfo(userUUID) {
    if (!userUUID) {
      return null;
    }
    let userId = await User.getInternalIdFromUUID(userUUID);
    let ret = camelizeKeys(
      await knex('user_subscriptions')
        .select('s.expiry_month', 's.expiry_year', 's.last4', 's.brand')
        .from('user_subscriptions as s')
        .where('s.user_id', '=', userId)
        .first()
    );
    if (!ret || ret.brand === null) {
      return null;
    }
    return ret;
  }
}
