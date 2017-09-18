import { PubSub } from "graphql-subscriptions";

const COUNT_UPDATED_TOPIC = 'count_updated';

export default (pubsub: PubSub) => ({
  Query: {
    count(obj: any, args: any, context: any) {
      return context.Count.getCount();
    }
  },
  Mutation: {
    async addCount(obj: any, { amount }: { amount: number }, context: any) {
      await context.Count.addCount(amount);
      const count = await context.Count.getCount();

      pubsub.publish(COUNT_UPDATED_TOPIC, {
        countUpdated: { amount: count.amount }
      });

      return count;
    }
  },
  Subscription: {
    countUpdated: {
      subscribe: () => pubsub.asyncIterator(COUNT_UPDATED_TOPIC)
    }
  }
});
