/*eslint-disable no-unused-vars*/
export default pubsub => ({
  Query: {
    users(obj, args, context) {
      return context.User.getUsers();
    },
    currentUser(obj, { id }, context) {
      return context.User.getUser(id);
    },
  },
  Mutation: {
  },
  Subscription: {
  }
});
