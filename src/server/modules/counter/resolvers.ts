import { PubSub } from 'graphql-subscriptions';

const COUNTER_SUBSCRIPTION = 'counter_subscription';

export default (pubsub: PubSub) => ({
  Query: {
    counter(obj: any, args: any, context: any) {
      return context.Counter.counterQuery();
    }
  },
  Mutation: {
    async addCounter(obj: any, { amount }: { amount: number }, context: any) {
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
