import { json } from 'body-parser';
import { Express } from 'express';

import StripeRecurrentDAO from './sql';

import schema from './schema.graphql';
import createResolvers from './resolvers';
import Feature from '../../../connector';

import stripeLocalMiddleware from './stripeLocal';
import webhookMiddleware from './webhook';
import resources from './locales';
import settings from '../../../../../../../settings';

const StripeRecurrent = new StripeRecurrentDAO();

export default new Feature(
  settings.payments.stripe.recurring.enabled
    ? {
        schema,
        createResolversFunc: createResolvers,
        createContextFunc: async ({ context: { user } }: any) => ({
          StripeRecurrent,
          subscription: user ? await StripeRecurrent.getStripeRecurrent(user.id) : null
        }),
        beforeware: (app: Express) => {
          app.use(settings.payments.stripe.recurring.webhookUrl, json());
        },
        middleware: (app: Express) => {
          app.use(stripeLocalMiddleware());
          app.post(settings.payments.stripe.recurring.webhookUrl, webhookMiddleware);
        },
        localization: { ns: 'subscription', resources }
      }
    : {}
);
