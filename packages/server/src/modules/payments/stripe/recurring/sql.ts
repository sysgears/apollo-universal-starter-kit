import { camelizeKeys, decamelizeKeys } from 'humps';
import knex from '../../../../sql/connector';
import { returnId } from '../../../../sql/helpers';

export interface StripeRecurrent {
  userId: number;
  active: boolean;
  stripeSourceId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  expiryMonth: number;
  expiryYear: number;
  last4: number;
  brand: string;
}

interface StripeRecurrentProps {
  userId: number;
  [key: string]: any;
}

export default class StripeRecurrentDAO {
  public async editStripeRecurrent({ userId, ...stripeRecurrent }: StripeRecurrentProps) {
    const userStripeRecurrent = await knex('subscription')
      .select('id')
      .where({ user_id: userId })
      .first();

    if (userStripeRecurrent) {
      return returnId(knex('subscription'))
        .update(decamelizeKeys(stripeRecurrent))
        .where({ user_id: userId });
    } else {
      return returnId(knex('subscription')).insert({ ...decamelizeKeys(stripeRecurrent), user_id: userId });
    }
  }

  public async getStripeRecurrent(userId: number): Promise<StripeRecurrent> {
    return camelizeKeys(
      await knex('subscription')
        .select('s.*')
        .from('subscription as s')
        .where('s.user_id', '=', userId)
        .first()
    ) as StripeRecurrent;
  }

  public async getStripeRecurrentByStripeRecurrentId(stripeRecurrentId: string): Promise<StripeRecurrent> {
    return camelizeKeys(
      await knex('subscription')
        .select('s.*')
        .from('subscription as s')
        .where('s.stripe_subscription_id', '=', stripeRecurrentId)
        .first()
    ) as StripeRecurrent;
  }

  public async getStripeRecurrentByStripeCustomerId(stripeCustomerId: string): Promise<StripeRecurrent> {
    return camelizeKeys(
      await knex('subscription')
        .select('s.*')
        .from('subscription as s')
        .where('s.stripe_customer_id', '=', stripeCustomerId)
        .first()
    ) as StripeRecurrent;
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
