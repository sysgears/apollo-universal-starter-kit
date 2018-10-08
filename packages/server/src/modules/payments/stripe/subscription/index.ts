// TypeScript compiler doesn't see global variables in deeply nested files
// without explicit reference to the declaration file.
/* tslint:disable:no-reference */
/// <reference path="../../../../../typings/typings.d.ts" />
import { json } from 'body-parser';
import { Express } from 'express';
import stripeLocal from 'stripe-local';

import ServerModule from '../../../ServerModule';
import settings from '../../../../../../../settings';
import log from '../../../../../../common/log';

import StripeSubscriptionDAO from './sql';
import schema from './schema.graphql';
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

const createContext = async ({ context: { user } }: any) => ({
  StripeSubscription,
  stripeSubscription: user ? await StripeSubscription.getSubscription(user.id) : null
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
      createContextFunc: [createContext],
      beforeware: [beforeware],
      middleware: [middleware],
      localization: [{ ns: 'stripeSubscription', resources }]
    })
  : undefined);
