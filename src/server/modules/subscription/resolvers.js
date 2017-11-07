/*eslint-disable no-unused-vars*/
import { pick } from 'lodash';
import Stripe from 'stripe';
import FieldError from '../../../common/FieldError';
import settings from '../../../../settings';

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

        const customer = await stripe.customers.create({ email: user.email, source: data.token });

        await context.Subscription.createSubscription({
          userId: user.id,
          stripeCustomerId: customer.id,
          expiryMonth: data.expiryMonth,
          expiryYear: data.expiryYear,
          last4: data.last4,
          brand: data.brand
        });

        const subscription = await stripe.subscriptions.create({
          customer: customer.id,
          items: [
            {
              plan: 'basic'
            }
          ]
        });

        await context.Subscription.updateSubscription({
          userId: user.id,
          active: true,
          stripeSubscriptionId: subscription.id
        });

        return { active: true, errors: null };
      } catch (e) {
        return { active: false, errors: e };
      }
    },
    async cancel(obj, args, context) {
      try {
        const { id } = await context.User.getUserByUsername(context.user.username);
        const { stripeSubscriptionId } = context.subscription;

        const confirmation = await stripe.subscriptions.del(stripeSubscriptionId);

        if (confirmation) {
          await context.Subscription.deleteSubscription({ userId: id });
        }

        return { active: false, errors: null };
      } catch (e) {
        return { active: true, errors: e };
      }
    }
  },
  Subscription: {}
});
