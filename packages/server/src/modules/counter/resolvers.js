const COUNTER_SUBSCRIPTION = 'counter_subscription';

export default pubsub => ({
  Query: {
    serverCounter(obj, args, context) {
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
