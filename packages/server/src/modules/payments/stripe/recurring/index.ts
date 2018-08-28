import { json } from 'body-parser';
import { Express } from 'express';

import StripeRecurringDAO from './sql';

import schema from './schema.graphql';
import createResolvers from './resolvers';
import Feature from '../../../connector';

import stripeLocalMiddleware from './stripeLocal';
import webhookMiddleware from './webhook';
import resources from './locales';
import settings from '../../../../../../../settings';

const StripeRecurring = new StripeRecurringDAO();
const { webhookUrl } = settings.payments.stripe.recurring;

export default new Feature(
  settings.payments.stripe.recurring.enabled
    ? {
        schema,
        createResolversFunc: createResolvers,
        createContextFunc: async ({ context: { user } }: any) => ({
          StripeRecurring,
          stripeRecurring: user ? await StripeRecurring.getRecurring(user.id) : null
        }),
        beforeware: (app: Express) => {
          app.use(webhookUrl, json());
        },
        middleware: (app: Express) => {
          app.use(stripeLocalMiddleware());
          app.post(webhookUrl, webhookMiddleware);
        },
        localization: { ns: 'subscription', resources }
      }
    : {}
);
