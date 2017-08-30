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
    async register(obj, { input }, context) {
      const [ id ] = await context.User.register(input);
      const user = await context.User.getUser(id);

      console.log(user);

      return user;
    }
  },
  Subscription: {
  }
});
