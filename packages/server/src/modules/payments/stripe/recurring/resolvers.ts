import Stripe from 'stripe';

import log from '../../../../../../common/log';
import FieldError from '../../../../../../common/FieldError';
import settings from '../../../../../../../settings';

const { secretKey } = settings.payments.stripe.recurring;
const stripe = new Stripe(secretKey);

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
    stripeSubscription(obj: any, args: any, context: any) {
      return context.stripeSubscription;
    },
    stripeSubscriptionProtectedNumber(obj: any, args: any, context: any) {
      if (!context.stripeSubscription || !context.stripeSubscription.active) {
        return;
      }
      return { number: Math.floor(Math.random() * 10) };
    },
    async stripeSubscriptionCard(obj: any, args: any, context: any) {
      return !context.user ? undefined : context.StripeSubscription.getCardInfo(context.user.id);
    }
  },
  Mutation: {
    async addStripeSubscription(obj: any, { input }: CreditCard, context: any) {
      try {
        const { user, stripeSubscription, StripeSubscription } = context;
        const { token, expiryMonth, expiryYear, last4, brand } = input;
        let stripeCustomerId;
        let stripeSourceId;

        // use existing stripe customer if user has subscribed before
        if (stripeSubscription && stripeSubscription.stripeCustomerId) {
          const { id } = await stripe.customers.createSource(stripeSubscription.stripeCustomerId, { source: token });
          stripeCustomerId = stripeSubscription.stripeCustomerId;
          stripeSourceId = id;
        } else {
          const { id, default_source } = await stripe.customers.create({ email: user.email, source: token });
          stripeCustomerId = id;
          stripeSourceId = default_source;
        }

        await StripeSubscription.editSubscription({
          userId: user.id,
          active: false,
          stripeCustomerId,
          stripeSourceId,
          expiryMonth,
          expiryYear,
          last4,
          brand
        });

        const newSubscriber = await stripe.subscriptions.create({
          customer: stripeCustomerId,
          items: [{ plan: 'basic' }]
        });

        await StripeSubscription.editSubscription({
          userId: user.id,
          active: true,
          stripeSubscriptionId: newSubscriber.id
        });

        return { active: true, errors: null };
      } catch (e) {
        return { active: false, errors: e };
      }
    },
    async updateStripeSubscriptionCard(obj: any, { input }: CreditCard, context: any) {
      try {
        const { token, expiryMonth, expiryYear, last4, brand } = input;
        const { StripeSubscription, user, stripeSubscription } = context;

        await stripe.customers.deleteSource(stripeSubscription.stripeCustomerId, stripeSubscription.stripeSourceId);
        const source = await stripe.customers.createSource(stripeSubscription.stripeCustomerId, { source: token });

        await StripeSubscription.editSubscription({
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
    async cancelStripeSubscription(obj: any, args: any, context: any) {
      try {
        const { user, stripeSubscription, StripeSubscription, req } = context;
        const { stripeSubscriptionId, stripeCustomerId, stripeSourceId } = stripeSubscription;

        try {
          await stripe.subscriptions.del(stripeSubscriptionId);
          await stripe.customers.deleteSource(stripeCustomerId, stripeSourceId);
        } catch (err) {
          log.error(err);
          const e = new FieldError();
          e.setError('stripeSubscription', req.t('stripeSubscription:cancelError'));
          e.throwIf();
        }

        await StripeSubscription.editSubscription({
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
