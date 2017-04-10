import { SubscriptionManager } from 'graphql-subscriptions';

import schema, { pubsub } from './schema';
import { createModulesSubscriptionSetup } from '../modules';

const subscriptionManager = new SubscriptionManager({
  schema,
  pubsub,
  setupFunctions : createModulesSubscriptionSetup(),
});

export { subscriptionManager, pubsub };