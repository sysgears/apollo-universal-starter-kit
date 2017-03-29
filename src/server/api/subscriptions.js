import { SubscriptionManager } from 'graphql-subscriptions'
import { merge } from 'lodash'

import schema, { pubsub } from './schema'

import postSetupFunctions from './subscriptions/post_subscriptions'

const rootSetupFunctions = {
  countUpdated: () => ({
    // Run the query each time count updated
    countUpdated: () => true
  })
};

const setupFunctions = merge(rootSetupFunctions, postSetupFunctions);

const subscriptionManager = new SubscriptionManager({
  schema,
  pubsub,
  setupFunctions,
});

export { subscriptionManager, pubsub };