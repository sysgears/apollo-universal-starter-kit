import Stripe from 'stripe';
import withAuth from 'graphql-auth';
import { log } from '@module/core-common';
import { FieldError } from '@module/validation-common-react';

import settings from '../../../../../settings';

const { plan } = settings.stripe.subscription;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
    stripeSubscription: withAuth(['stripe:view:self'], (obj: any, args: any, { stripeSubscription }: any) => {
      return { active: !!(stripeSubscription && stripeSubscription.active) };
    }),
    stripeSubscriptionProtectedNumber: withAuth(['stripe:view:self'], (obj: any, args: any, context: any) => {
      return context.stripeSubscription && context.stripeSubscription.active
        ? { number: Math.floor(Math.random() * 10) }
        : null;
    }),
    stripeSubscriptionCard: withAuth(['stripe:view:self'], (obj: any, args: any, context: any) => {
      return context.StripeSubscription.getCreditCard(context.user.id);
    })
  },
  Mutation: {
    addStripeSubscription: withAuth(['stripe:update:self'], async (obj: any, { input }: CreditCard, context: any) => {
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
          items: [{ plan: plan.id }]
        });

        await StripeSubscription.editSubscription({
          userId: user.id,
          active: true,
          stripeSubscriptionId: newSubscriber.id
        });

        return { active: true, errors: null };
      } catch (e) {
        log.error(e);
        return { active: false, errors: e };
      }
    }),
    updateStripeSubscriptionCard: withAuth(['stripe:update:self'], async (obj: any, args: CreditCard, context: any) => {
      try {
        const { token, expiryMonth, expiryYear, last4, brand } = args.input;
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
    }),
    cancelStripeSubscription: withAuth(['stripe:update:self'], async (obj: any, args: any, context: any) => {
      try {
        const { user, stripeSubscription, StripeSubscription, req } = context;
        const { stripeSubscriptionId, stripeCustomerId, stripeSourceId } = stripeSubscription;

        try {
          await stripe.subscriptions.del(stripeSubscriptionId);
          await stripe.customers.deleteSource(stripeCustomerId, stripeSourceId);
        } catch (err) {
          log.error(err);
          const e = new FieldError();
          e.setError('cancelSubscription', req.t('stripeSubscription:cancelError'));
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
        log.error(e);
        return { active: true, errors: e };
      }
    })
  },
  Subscription: {}
});
