/*eslint-disable no-unused-vars*/
import { pick } from 'lodash';
import Stripe from 'stripe';
import FieldError from '../../../common/FieldError';
import settings from '../../../../settings';
import log from '../../../common/log';

const stripe = Stripe(settings.subscription.stripeSecretKey);

export default pubsub => ({
  Query: {
    subscription(obj, args, context) {
      return context.subscription;
    },
    subscribersOnlyNumber(obj, args, context) {
      if (!context.subscription.active) return;
      const number = Math.floor(Math.random() * 10);
      return { number };
    },
    async subscriptionCardInfo(obj, args, context) {
      const { user } = context;
      return context.Subscription.getCardInfo(user.id);
    }
  },
  Mutation: {
    async subscribe(obj, { input }, context) {
      try {
        const e = new FieldError();
        const data = pick(input, ['token', 'expiryMonth', 'expiryYear', 'last4', 'brand']);
        const user = await context.User.getUserByUsername(context.user.username);
        const { subscription } = context;

        let customerId, stripeSourceId;

        // use existing stripe customer if user has subscribed before
        if (subscription && subscription.stripeCustomerId) {
          customerId = subscription.stripeCustomerId;
          const source = await stripe.customers.createSource(customerId, {
            source: data.token
          });
          stripeSourceId = source.id;
        } else {
          const customer = await stripe.customers.create({ email: user.email, source: data.token });
          customerId = customer.id;
          stripeSourceId = customer.default_source;
        }

        await context.Subscription.editSubscription({
          userId: user.id,
          subscription: {
            stripeCustomerId: customerId,
            stripeSourceId,
            expiryMonth: data.expiryMonth,
            expiryYear: data.expiryYear,
            last4: data.last4,
            brand: data.brand
          }
        });

        const newSubscription = await stripe.subscriptions.create({
          customer: customerId,
          items: [
            {
              plan: 'basic'
            }
          ]
        });

        await context.Subscription.editSubscription({
          userId: user.id,
          subscription: {
            active: true,
            stripeSubscriptionId: newSubscription.id
          }
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
        const { subscription: { stripeCustomerId, stripeSourceId } } = context;

        await stripe.customers.deleteSource(stripeCustomerId, stripeSourceId);
        const source = await stripe.customers.createSource(stripeCustomerId, {
          source: data.token
        });

        await context.Subscription.editSubscription({
          userId: user.id,
          subscription: {
            stripeSourceId: source.id,
            expiryMonth: data.expiryMonth,
            expiryYear: data.expiryYear,
            last4: data.last4,
            brand: data.brand
          }
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
          const e = new FieldError();
          e.setError('subscription', 'Error cancelling subscription.');
          e.throwIf();
        }

        await context.Subscription.editSubscription({
          userId: id,
          subscription: {
            active: false,
            stripeSourceId: null,
            stripeSubscriptionId: null,
            expiryMonth: null,
            expiryYear: null,
            last4: null,
            brand: null
          }
        });

        return { active: false, errors: null };
      } catch (e) {
        return { active: true, errors: e };
      }
    }
  },
  Subscription: {}
});
