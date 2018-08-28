import { camelizeKeys, decamelizeKeys } from 'humps';
import knex from '../../../../sql/connector';
import { returnId } from '../../../../sql/helpers';

export interface Recurring {
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

interface RecurringProps {
  userId: number;
  [key: string]: any;
}

export default class StripeRecurringDAO {
  public async editRecurring({ userId, ...recurring }: RecurringProps) {
    const recurringId = await knex('subscription')
      .select('id')
      .where({ user_id: userId })
      .first();

    if (recurringId) {
      return returnId(knex('subscription'))
        .update(decamelizeKeys(recurring))
        .where({ user_id: userId });
    } else {
      return returnId(knex('subscription')).insert(decamelizeKeys({ userId, ...recurring }));
    }
  }

  public async getRecurring(userId: number): Promise<Recurring> {
    return camelizeKeys(
      await knex('subscription')
        .select('s.*')
        .from('subscription as s')
        .where('s.user_id', '=', userId)
        .first()
    ) as Recurring;
  }

  public async getRecurringByStripeRecurringId(stripeRecurringId: string): Promise<Recurring> {
    return camelizeKeys(
      await knex('subscription')
        .select('s.*')
        .from('subscription as s')
        .where('s.stripe_subscription_id', '=', stripeRecurringId)
        .first()
    ) as Recurring;
  }

  public async getRecurringByStripeCustomerId(stripeCustomerId: string): Promise<Recurring> {
    return camelizeKeys(
      await knex('subscription')
        .select('s.*')
        .from('subscription as s')
        .where('s.stripe_customer_id', '=', stripeCustomerId)
        .first()
    ) as Recurring;
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
