/*eslint-disable no-unused-vars*/
import { pick } from 'lodash';
import Stripe from 'stripe';

import log from '../../../../../../common/log';
import FieldError from '../../../../../../common/FieldError';
import settings from '../../../../../../../settings';

const stripe = Stripe(settings.subscription.stripeSecretKey);

export default pubsub => ({
  Query: {
    subscription(obj, args, context) {
      return context.subscription;
    },
    subscribersOnlyNumber(obj, args, context) {
      if (!context.subscription || !context.subscription.active) { return; }
      return { number: Math.floor(Math.random() * 10) };
    },
    async subscriptionCardInfo(obj, args, { user, Subscription }) {
      return !user ? undefined : Subscription.getCardInfo(user.id);
    }
  },
  Mutation: {
    async subscribe(obj, { input }, context) {
      try {
        const { subscription, Subscription } = context;
        const data = pick(input, ['token', 'expiryMonth', 'expiryYear', 'last4', 'brand']);
        const user = await context.User.getUserByUsername(context.user.username);
        let stripeCustomerId, stripeSourceId;

        // use existing stripe customer if user has subscribed before
        if (subscription && subscription.stripeCustomerId) {
          const source = await stripe.customers.createSource(stripeCustomerId, { source: data.token });
          stripeCustomerId = subscription.stripeCustomerId;
          stripeSourceId = source.id;
        } else {
          const { id, default_source } = await stripe.customers.create({ email: user.email, source: data.token });
          stripeCustomerId = id;
          stripeSourceId = default_source;
        }

        await Subscription.editSubscription({
          userId: user.id,
          stripeCustomerId,
          stripeSourceId,
          expiryMonth: data.expiryMonth,
          expiryYear: data.expiryYear,
          last4: data.last4,
          brand: data.brand
        });

        const newSubscription = await stripe.subscriptions.create({
          customer: stripeCustomerId,
          items: [
            {
              plan: 'basic'
            }
          ]
        });

        await Subscription.editSubscription({
          userId: user.id,
          active: true,
          stripeSubscriptionId: newSubscription.id
        });

        return { active: true, errors: null };
      } catch (e) {
        return { active: false, errors: e };
      }
    },
    async updateCard(obj, { input }, context) {
      try {
        const data = pick(input, ['token', 'expiryMonth', 'expiryYear', 'last4', 'brand']);
        const user = await context.User.getUserByUsername(context.user.username);
        const {
          subscription: { stripeCustomerId, stripeSourceId }
        } = context;

        await stripe.customers.deleteSource(stripeCustomerId, stripeSourceId);
        const source = await stripe.customers.createSource(stripeCustomerId, { source: data.token });

        await context.Subscription.editSubscription({
          userId: user.id,
          stripeSourceId: source.id,
          expiryMonth: data.expiryMonth,
          expiryYear: data.expiryYear,
          last4: data.last4,
          brand: data.brand
        });

        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    },
    async cancel(obj, args, context) {
      try {
        const { id } = await context.User.getUserByUsername(context.user.username);
        const { stripeSubscriptionId, stripeCustomerId, stripeSourceId } = context.subscription;

        try {
          await stripe.subscriptions.del(stripeSubscriptionId);
          await stripe.customers.deleteSource(stripeCustomerId, stripeSourceId);
        } catch (e) {
          log.error(e);
          const e = new FieldError();
          e.setError('subscription', context.req.t('subscription:cancelSubscription'));
          e.throwIf();
        }

        await context.Subscription.editSubscription({
          userId: id,
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
