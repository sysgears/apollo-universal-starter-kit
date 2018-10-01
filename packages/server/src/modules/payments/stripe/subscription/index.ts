/* tslint:disable:no-reference */
/// <reference path="../../../../../typings/typings.d.ts" />
import { json } from 'body-parser';
import { Express } from 'express';
import stripeLocal from 'stripe-local';

import Feature from '../../../connector';
import settings from '../../../../../../../settings';
import log from '../../../../../../common/log';

import StripeSubscriptionDAO from './sql';
import schema from './schema.graphql';
import createResolvers from './resolvers';
import webhookMiddleware from './webhook';
import resources from './locales';

const StripeSubscription = new StripeSubscriptionDAO();
const { webhookUrl, secretKey } = settings.stripe.subscription;

/**
 * Requests Stripe events and sends them to our webhook in development mode.
 * This functionality allows for full Stripe functionality just as in production mode.
 */
if (__DEV__ && secretKey) {
  log.debug('Starting stripe-local proxy');
  stripeLocal({ secretKey, webhookUrl: `http://localhost:${__SERVER_PORT__}${webhookUrl}` });
}

export default new Feature(
  secretKey
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
          app.post(webhookUrl, webhookMiddleware);
        },
        localization: { ns: 'stripeSubscription', resources }
      }
    : {}
);
