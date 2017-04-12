export default pubsub => ({
  Query: {
    count(obj, args, context) {
      return context.Count.getCount();
    },
  },
  Mutation: {
    addCount(obj, { amount }, context) {
      return context.Count.addCount(amount)
        .then(() => context.Count.getCount())
        .then(count => {
          pubsub.publish('countUpdated', count);
          return count;
        });
    },
  },
  Subscription: {
    countUpdated(amount) {
      return amount;
    }
  }
});
