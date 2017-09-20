const UPDATE_COUNT = 'update_count';

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

      pubsub.publish(UPDATE_COUNT, {
        updateCount: { amount: count.amount }
      });

      return count;
    }
  },
  Subscription: {
    updateCount: {
      subscribe: () => pubsub.asyncIterator(UPDATE_COUNT)
    }
  }
});
