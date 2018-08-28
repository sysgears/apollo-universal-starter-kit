import Stripe from 'stripe';

import log from '../../../../../../common/log';
import FieldError from '../../../../../../common/FieldError';
import settings from '../../../../../../../settings';

const stripe = new Stripe(settings.payments.stripe.recurring.stripeSecretKey);

interface CreditCard {
  input: {
    token: string;
    expiryMonth: number;
    expiryYear: number;
    last4: number;
    brand: string;
  };
}

export default () => ({
  Query: {
    subscription(obj: any, args: any, context: any) {
      return context.subscription;
    },
    subscribersOnlyNumber(obj: any, args: any, context: any) {
      if (!context.subscription || !context.subscription.active) {
        return;
      }
      return { number: Math.floor(Math.random() * 10) };
    },
    async subscriptionCardInfo(obj: any, args: any, context: any) {
      return !context.user ? undefined : context.StripeRecurrent.getCardInfo(context.user.id);
    }
  },
  Mutation: {
    async subscribe(obj: any, { input }: CreditCard, context: any) {
      try {
        const { user, subscription, StripeRecurrent } = context;
        const { token, expiryMonth, expiryYear, last4, brand } = input;
        let stripeCustomerId;
        let stripeSourceId;

        // use existing stripe customer if user has subscribed before
        if (subscription && subscription.stripeCustomerId) {
          const source = await stripe.customers.createSource(subscription.stripeCustomerId, { source: token });
          stripeCustomerId = subscription.stripeCustomerId;
          stripeSourceId = source.id;
        } else {
          const { id, default_source } = await stripe.customers.create({ email: user.email, source: token });
          stripeCustomerId = id;
          stripeSourceId = default_source;
        }

        await StripeRecurrent.editStripeRecurrent({
          userId: user.id,
          active: false,
          stripeCustomerId,
          stripeSourceId,
          expiryMonth,
          expiryYear,
          last4,
          brand
        });

        const newSubscription = await stripe.subscriptions.create({
          customer: stripeCustomerId,
          items: [{ plan: 'basic' }]
        });

        await StripeRecurrent.editStripeRecurrent({
          userId: user.id,
          active: true,
          stripeSubscriptionId: newSubscription.id
        });

        return { active: true, errors: null };
      } catch (e) {
        return { active: false, errors: e };
      }
    },
    async updateCard(obj: any, { input }: CreditCard, context: any) {
      try {
        const { token, expiryMonth, expiryYear, last4, brand } = input;
        const { StripeRecurrent, user, subscription } = context;

        await stripe.customers.deleteSource(subscription.stripeCustomerId, subscription.stripeSourceId);
        const source = await stripe.customers.createSource(subscription.stripeCustomerId, { source: token });

        await StripeRecurrent.editStripeRecurrent({
          userId: user.id,
          stripeSourceId: source.id,
          expiryMonth,
          expiryYear,
          last4,
          brand
        });

        return true;
      } catch (e) {
        log.error(e);
        return false;
      }
    },
    async cancel(obj: any, args: any, context: any) {
      try {
        const { user, subscription, StripeRecurrent, req } = context;
        const { stripeSubscriptionId, stripeCustomerId, stripeSourceId } = subscription;

        try {
          await stripe.subscriptions.del(stripeSubscriptionId);
          await stripe.customers.deleteSource(stripeCustomerId, stripeSourceId);
        } catch (err) {
          log.error(err);
          const e = new FieldError();
          e.setError('subscription', req.t('subscription:cancelSubscription'));
          e.throwIf();
        }

        await StripeRecurrent.editStripeRecurrent({
          userId: user.id,
          active: false,
          stripeSourceId: null,
          stripeSubscriptionId: null,
          expiryMonth: null,
          expiryYear: null,
          last4: null,
          brand: null
        });

        return { active: false, errors: null };
      } catch (e) {
        return { active: true, errors: e };
      }
    }
  },
  Subscription: {}
});
