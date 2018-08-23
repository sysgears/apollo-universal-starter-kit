import { json } from 'body-parser';

import SubscriptionDAO from './sql';

import schema from './schema.graphql';
import createResolvers from './resolvers';
import Feature from '../connector';

import stripeLocalMiddleware from './stripeLocal';
import webhookMiddleware from './webhook';
import resources from './locales';
import settings from '../../../../../settings';

const Subscription = new SubscriptionDAO();

export default new Feature(
  settings.subscription.enabled
    ? {
        schema,
        createResolversFunc: createResolvers,
        createContextFunc: async ({ context: { user } }) => ({
          Subscription,
          subscription: user ? await Subscription.getSubscription(user.id) : null
        }),
        beforeware: app => {
          app.use(settings.subscription.webhookUrl, json());
        },
        middleware: app => {
          app.use(stripeLocalMiddleware());
          app.post(settings.subscription.webhookUrl, webhookMiddleware);
        },
        localization: { ns: 'subscription', resources }
      }
    : {}
);
