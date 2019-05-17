import { json } from 'body-parser';
import { Express } from 'express';
import stripeLocal from 'stripe-local';

import ServerModule from '@gqlapp/module-server-ts';
import { log } from '@gqlapp/core-common';
import settings from '@gqlapp/config';

import StripeSubscriptionDAO from './sql';
import schema from './schema';
import createResolvers from './resolvers';
import webhookMiddleware from './webhook';
import resources from './locales';

const StripeSubscription = new StripeSubscriptionDAO();
const { webhookUrl, enabled } = settings.stripe.subscription;

/**
 * Requests Stripe events and sends them to our webhook in development mode.
 */
if (__DEV__ && enabled && process.env.STRIPE_SECRET_KEY) {
  log.debug('Starting stripe-local proxy');
  stripeLocal({
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookUrl: `http://localhost:${__SERVER_PORT__}${webhookUrl}`
  });
}

const createContextFunc = async ({ graphqlContext: { identity } }: any) => ({
  StripeSubscription,
  stripeSubscription: identity ? await StripeSubscription.getSubscription(identity.id) : null
});

const beforeware = (app: Express) => {
  app.use(webhookUrl, json());
};

const middleware = (app: Express) => {
  app.post(webhookUrl, webhookMiddleware);
};

export default (enabled
  ? new ServerModule({
      schema: [schema],
      createResolversFunc: [createResolvers],
      createContextFunc: [createContextFunc],
      beforeware: [beforeware],
      middleware: [middleware],
      localization: [{ ns: 'stripeSubscription', resources }]
    })
  : undefined);
