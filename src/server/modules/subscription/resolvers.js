/*eslint-disable no-unused-vars*/
export default pubsub => ({
  Query: {
    subscription(obj, args, context) {
      if (context.user) {
        return context.Subscription.getSubscription(context.user.id);
      } else {
        return null;
      }
    }
  },
  Mutation: {},
  Subscription: {}
});
