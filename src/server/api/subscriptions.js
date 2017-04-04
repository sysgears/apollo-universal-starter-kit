import { SubscriptionManager } from 'graphql-subscriptions'
import { merge } from 'lodash'

import schema, { pubsub } from './schema'
import allSetupFunctions from './subscription_functions'

const rootSetupFunctions = {
  countUpdated: () => ({
    // Run the query each time count updated
    countUpdated: () => true
  })
};

const setupFunctions = merge(rootSetupFunctions, ...allSetupFunctions);

const subscriptionManager = new SubscriptionManager({
  schema,
  pubsub,
  setupFunctions,
});

export { subscriptionManager, pubsub };