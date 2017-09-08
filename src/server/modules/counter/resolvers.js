const COUNT_UPDATED_TOPIC = 'count_updated';

export default pubsub => ({
  Query: {
    count(obj, args, context) {
      return context.Count.getCount();
    }
  },
  Mutation: {
    async addCount(obj, { amount }, context) {
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
