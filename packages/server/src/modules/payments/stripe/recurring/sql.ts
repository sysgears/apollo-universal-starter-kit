import { camelizeKeys, decamelizeKeys } from 'humps';
import knex from '../../../../sql/connector';
import { returnId } from '../../../../sql/helpers';

interface Subscription {
  userId: number;
  subscription: {
    active: boolean;
    stripeSourceId: string;
    stripeSubscriptionId: string;
    expiryMonth: number;
    expiryYear: number;
    last4: number;
    brand: string;
  };
}

export default class SubscriptionDAO {
  public async editSubscription({ userId, subscription }: Subscription) {
    const userSubscription = await knex('subscription')
      .select('id')
      .where({ user_id: userId })
      .first();

    if (userSubscription) {
      return returnId(knex('subscription'))
        .update(decamelizeKeys(subscription))
        .where({ user_id: userId });
    } else {
      return returnId(knex('subscription')).insert({ ...decamelizeKeys(subscription), user_id: userId });
    }
  }

  public async getSubscription(userId: number) {
    return camelizeKeys(
      await knex('subscription')
        .select('s.*')
        .from('subscription as s')
        .where('s.user_id', '=', userId)
        .first()
    );
  }

  public async getSubscriptionByStripeSubscriptionId(stripeSubscriptionId: string) {
    return camelizeKeys(
      await knex('subscription')
        .select('s.*')
        .from('subscription as s')
        .where('s.stripe_subscription_id', '=', stripeSubscriptionId)
        .first()
    );
  }

  public async getSubscriptionByStripeCustomerId(stripeCustomerId: string) {
    return camelizeKeys(
      await knex('subscription')
        .select('s.*')
        .from('subscription as s')
        .where('s.stripe_customer_id', '=', stripeCustomerId)
        .first()
    );
  }

  public async getCardInfo(userId: number) {
    return camelizeKeys(
      await knex('subscription')
        .select('s.expiry_month', 's.expiry_year', 's.last4', 's.brand')
        .from('subscription as s')
        .where('s.user_id', '=', userId)
        .first()
    );
  }
}
