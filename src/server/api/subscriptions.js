import { SubscriptionManager } from 'graphql-subscriptions';

import schema, { pubsub } from './schema';
import modules from '../modules';

const subscriptionManager = new SubscriptionManager({
  schema,
  pubsub,
  setupFunctions: modules.subscriptionsSetups,
});

export { subscriptionManager, pubsub };
