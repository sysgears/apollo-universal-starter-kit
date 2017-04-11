import { SubscriptionManager } from 'graphql-subscriptions';

import schema, { pubsub } from './schema';
import { graphQLSubscriptionSetup } from '../modules';

const subscriptionManager = new SubscriptionManager({
  schema,
  pubsub,
  setupFunctions: graphQLSubscriptionSetup,
});

export { subscriptionManager, pubsub };
