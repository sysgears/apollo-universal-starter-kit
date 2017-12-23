// Components
import SubscriptionDAO from './sql';

import schema from './schema.graphql';
import createResolvers from './resolvers';
import Feature from '../connector';

import stripeLocalMiddleware from './stripeLocal';
import webhookMiddleware from './webhook';

import parseUser from '../authentication/flow/parseUser';

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: async (req, connectionParams, webSocket) => {
    const Subscription = new SubscriptionDAO();

    const tokenUser = await parseUser({ req, connectionParams, webSocket });
    const subscription = tokenUser ? await Subscription.getSubscription(tokenUser.userId) : null;

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
