/*eslint-disable no-unused-vars*/
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pick } from 'lodash';

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
    },
    async login(obj, { input: { email, password } }, context) {
      const user = await context.User.getUserByEmail(email);

      if (!user) {
        throw Error('No user with this email!');
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        throw Error('Incorrect password!');
      }

      const token = jwt.sign(
        { user: pick(user, 'id', 'username') },
        context.SECRET,
        { expiresIn: '1y' });

      return token;
    }
  },
  Subscription: {
  }
});
