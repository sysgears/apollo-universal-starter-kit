import * as models from '../../../typings/graphql';
import Counter from './sql';
import { PubSub } from 'graphql-subscriptions';

const COUNTER_SUBSCRIPTION = 'counter_subscription';

interface Context {
  Counter: Counter;
}

export default (
  pubsub: PubSub
): {
  Query: models.QueryResolvers.Resolvers<Context>;
  Mutation: models.MutationResolvers.Resolvers<Context>;
  Subscription: models.SubscriptionResolvers.Resolvers<Context>;
} => ({
  Query: {
    async serverCounter(obj, args, context) {
      return context.Counter.counterQuery();
    }
  },
  Mutation: {
    async addServerCounter(obj, { amount }, context) {
      await context.Counter.addCounter(amount);
      const counter = await context.Counter.counterQuery();

      pubsub.publish(COUNTER_SUBSCRIPTION, {
        counterUpdated: { amount: counter.amount }
      });

      return counter;
    }
  },
  Subscription: {
    counterUpdated: {
      subscribe: () => pubsub.asyncIterator(COUNTER_SUBSCRIPTION)
    }
  }
});
