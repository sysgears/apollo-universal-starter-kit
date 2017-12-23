// Components
import SubscriptionDAO from './sql';

import schema from './schema.graphql';
import createResolvers from './resolvers';
import Feature from '../connector';

import stripeLocalMiddleware from './stripeLocal';
import webhookMiddleware from './webhook';

import { parseUser } from '../user';

const Subscription = new SubscriptionDAO();

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: async (req, connectionParams, webSocket) => {
    const tokenUser = await parseUser({ req, connectionParams, webSocket });
    const subscription = tokenUser ? await Subscription.getSubscription(tokenUser.id) : null;

    return {
      Subscription,
      subscription
    };
  },
  middleware: app => {
    app.use(stripeLocalMiddleware());
    app.post('/stripe/webhook', webhookMiddleware);
  }
});
