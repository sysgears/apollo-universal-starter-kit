import { ApolloError } from 'apollo-server-errors';
import Stripe from 'stripe';
import withAuth from 'graphql-auth';

import { log } from '@gqlapp/core-common';
import settings from '@gqlapp/config';

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
      return context.StripeSubscription.getCreditCard(context.identity.id);
    })
  },
  Mutation: {
    addStripeSubscription: withAuth(['stripe:update:self'], async (obj: any, { input }: CreditCard, context: any) => {
      try {
        const { identity, stripeSubscription, StripeSubscription } = context;
        const { token, expiryMonth, expiryYear, last4, brand } = input;
        let stripeCustomerId;
        let stripeSourceId;

        // use existing stripe customer if user has subscribed before
        if (stripeSubscription && stripeSubscription.stripeCustomerId) {
          const { id } = await stripe.customers.createSource(stripeSubscription.stripeCustomerId, { source: token });
          stripeCustomerId = stripeSubscription.stripeCustomerId;
          stripeSourceId = id;
        } else {
          const { id, default_source } = await stripe.customers.create({ email: identity.email, source: token });
          stripeCustomerId = id;
          stripeSourceId = default_source;
        }

        await StripeSubscription.editSubscription({
          userId: identity.id,
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
          userId: identity.id,
          active: true,
          stripeSubscriptionId: newSubscriber.id
        });

        return { active: true };
      } catch (e) {
        log.error(e);
        if (e.code === 'resource_missing') {
          throw new ApolloError(e.message, e.code);
        }
        throw new Error(e.message);
      }
    }),
    updateStripeSubscriptionCard: withAuth(['stripe:update:self'], async (obj: any, args: CreditCard, context: any) => {
      try {
        const { token, expiryMonth, expiryYear, last4, brand } = args.input;
        const { StripeSubscription, identity, stripeSubscription } = context;

        await stripe.customers.deleteSource(stripeSubscription.stripeCustomerId, stripeSubscription.stripeSourceId);
        const source = await stripe.customers.createSource(stripeSubscription.stripeCustomerId, { source: token });

        await StripeSubscription.editSubscription({
          userId: identity.id,
          stripeSourceId: source.id,
          expiryMonth,
          expiryYear,
          last4,
          brand
        });

        return true;
      } catch (e) {
        log.error(e);
        if (e.code === 'resource_missing') {
          throw new ApolloError(e.message, e.code);
        }
        throw new Error(e.message);
      }
    }),
    cancelStripeSubscription: withAuth(['stripe:update:self'], async (obj: any, args: any, context: any) => {
      const {
        identity,
        stripeSubscription: { stripeSubscriptionId, stripeCustomerId, stripeSourceId },
        StripeSubscription
      } = context;

      try {
        await stripe.subscriptions.del(stripeSubscriptionId);
        await stripe.customers.deleteSource(stripeCustomerId, stripeSourceId);

        await StripeSubscription.editSubscription({
          userId: identity.id,
          active: false,
          stripeSourceId: null,
          stripeSubscriptionId: null,
          expiryMonth: null,
          expiryYear: null,
          last4: null,
          brand: null
        });

        return { active: false };
      } catch (e) {
        log.error(e);
        if (e.code === 'resource_missing') {
          throw new ApolloError(e.message, e.code);
        }
        throw new Error(e.message);
      }
    })
  },
  Subscription: {}
});
