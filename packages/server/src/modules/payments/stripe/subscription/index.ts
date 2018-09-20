import { json } from 'body-parser';
import { Express } from 'express';

import StripeSubscriptionDAO from './sql';

import schema from './schema.graphql';
import createResolvers from './resolvers';
import Feature from '../../../connector';

import stripeLocalMiddleware from './stripeLocal';
import webhookMiddleware from './webhook';
import resources from './locales';
import settings from '../../../../../../../settings';

const StripeSubscription = new StripeSubscriptionDAO();
const { webhookUrl, enabled } = settings.payments.stripe.subscription;

export default new Feature(
  enabled
    ? {
        schema,
        createResolversFunc: createResolvers,
        createContextFunc: async ({ context: { user } }: any) => ({
          StripeSubscription,
          stripeSubscription: user ? await StripeSubscription.getSubscription(user.id) : null
        }),
        beforeware: (app: Express) => {
          app.use(webhookUrl, json());
        },
        middleware: (app: Express) => {
          app.use(stripeLocalMiddleware());
          app.post(webhookUrl, webhookMiddleware);
        },
        localization: { ns: 'stripeSubscription', resources }
      }
    : {}
);
