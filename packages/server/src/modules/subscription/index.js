// Components
import SubscriptionDAO from './sql';

import schema from './schema.graphql';
import createResolvers from './resolvers';
import Feature from '../connector';

import stripeLocalMiddleware from './stripeLocal';
import webhookMiddleware from './webhook';

const Subscription = new SubscriptionDAO();

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: async ({ context: { user } }) => {
    const subscription = user ? await Subscription.getSubscription(user.id) : null;

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
