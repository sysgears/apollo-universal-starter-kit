export default pubsub => ({
  Query: {
    count(obj, args, context) {
      return context.Count.getCount();
    },
  },
  Mutation: {
    async addCount(obj, { amount }, context) {
      await context.Count.addCount(amount);
      let count = await context.Count.getCount();

      pubsub.publish('countUpdated', count);

      return count;
    },
  },
  Subscription: {
    countUpdated(amount) {
      return amount;
    }
  }
});
