import Stripe from 'stripe';
import withAuth from 'graphql-auth';

import log from '../../../../../../common/log';
import FieldError from '../../../../../../common/FieldError';
import settings from '../../../../../../../settings';
import * as models from '../../../../../typings/graphql';
import StripeSubscriptionDAO, { Subscription } from './sql';

const { plan } = settings.stripe.subscription;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

interface Context {
  user: any;
  req: any;
  StripeSubscription: StripeSubscriptionDAO;
  stripeSubscription: Subscription;
}

export default (): {
  Query: models.QueryResolvers.Resolvers<Context>;
  Mutation: models.MutationResolvers.Resolvers<Context>;
} => ({
  Query: {
    stripeSubscription: withAuth<models.QueryResolvers.StripeSubscriptionResolver>(
      ['stripe:view:self'],
      (obj, args, { stripeSubscription }) => {
        return { active: !!(stripeSubscription && stripeSubscription.active) };
      }
    ),
    stripeSubscriptionProtectedNumber: withAuth<models.QueryResolvers.StripeSubscriptionProtectedNumberResolver>(
      ['stripe:view:self'],
      (obj, args, context) => {
        return context.stripeSubscription && context.stripeSubscription.active
          ? { number: Math.floor(Math.random() * 10) }
          : null;
      }
    ),
    stripeSubscriptionCard: withAuth<models.QueryResolvers.StripeSubscriptionCardResolver>(
      ['stripe:view:self'],
      (obj, args, context) => {
        return context.StripeSubscription.getCreditCard(context.user.id);
      }
    )
  },
  Mutation: {
    addStripeSubscription: withAuth<models.MutationResolvers.AddStripeSubscriptionResolver>(
      ['stripe:update:self'],
      async (obj, { input }, context) => {
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
      }
    ),
    updateStripeSubscriptionCard: withAuth<models.MutationResolvers.UpdateStripeSubscriptionCardResolver>(
      ['stripe:update:self'],
      async (obj, args, context) => {
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
      }
    ),
    cancelStripeSubscription: withAuth<models.MutationResolvers.CancelStripeSubscriptionResolver>(
      ['stripe:update:self'],
      async (obj, args, context) => {
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
      }
    )
  }
});
