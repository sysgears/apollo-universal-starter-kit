import { json } from 'body-parser';
import { Express } from 'express';

import ServerModule from '@gqlapp/module-server-ts';
import { log } from '@gqlapp/core-common';
import settings from '@gqlapp/config';

import StripeSubscriptionDAO from './sql';
import schema from './schema.graphql';
import createResolvers from './resolvers';
import webhookMiddleware from './webhook';
import resources from './locales';

const StripeSubscription = new StripeSubscriptionDAO();
const { webhookUrl, enabled } = settings.stripe.subscription;

const createContextFunc = async ({ req }: any) => ({
  StripeSubscription,
  stripeSubscription: req && req.identity ? await StripeSubscription.getSubscription(req.identity.id) : null,
});

const beforeware = (app: Express) => {
  app.use(webhookUrl, json());
};

const middleware = (app: Express) => {
  app.post(webhookUrl, webhookMiddleware);
};

export default enabled
  ? new ServerModule({
      schema: [schema],
      createResolversFunc: [createResolvers],
      createContextFunc: [createContextFunc],
      beforeware: [beforeware],
      middleware: [middleware],
      localization: [{ ns: 'stripeSubscription', resources }],
    })
  : undefined;
