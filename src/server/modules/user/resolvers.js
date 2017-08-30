/*eslint-disable no-unused-vars*/
import bcrypt from 'bcryptjs';

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
      input.password = await bcrypt.hash(input.password, 12);
      const [ id ] = await context.User.register(input);
      const user = await context.User.getUser(id);

      return user;
    }
  },
  Subscription: {
  }
});
