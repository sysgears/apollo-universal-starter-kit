import { SubscriptionManager } from 'graphql-subscriptions'
import schema, { pubsub } from './schema'

const subscriptionManager = new SubscriptionManager({
  schema,
  pubsub,
  setupFunctions: {
    countUpdated: () => ({
      // Run the query each time count updated
      countUpdated: () => true
    }),
    commentUpdated: () => ({
      commentUpdated: () => true,
    }),
  },
});

export { subscriptionManager, pubsub };