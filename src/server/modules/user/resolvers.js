/*eslint-disable no-unused-vars*/
import bcrypt from 'bcryptjs';
import { pick } from 'lodash';
import { refreshTokens, tryLogin } from './auth';
import { requiresAuth, requiresAdmin } from './permissions';

export default pubsub => ({
  Query: {
    users: requiresAdmin.createResolver((obj, args, context) => {
      return context.User.getUsers();
    }),
    user: requiresAuth.createResolver((obj, { id }, context) => {
      return context.User.getUser(id);
    }),
    currentUser(obj, args, context) {
      if(context.user) {
        return context.User.getUser(context.user.id);
      } else {
        return null;
      }
    },
  },
  Mutation: {
    async register(obj, { input }, context) {
      const localAuth = pick(input, ['email', 'password']);
      const passwordPromise = bcrypt.hash(localAuth.password, 12);
      const createUserPromise = context.User.register(input);

      const [password, [createdUserId]] = await Promise.all([passwordPromise, createUserPromise]);

      localAuth.password = password;

      const [id] = await context.User.createLocalOuth({
        ...localAuth,
        userId: createdUserId,
      });

      const user = await context.User.getUser(createdUserId);

      return user;
    },
    async login(obj, { input: { email, password } }, context) {
      return tryLogin(email, password, context.User, context.SECRET);
    },
    async updatePassword(obj, { id, newPassword }, context) {
      try {
        const password = await bcrypt.hash(newPassword, 12);
        await context.User.UpdatePassword(id, password);
        return true;
      } catch (e) {
        return false;
      }
    },
    refreshTokens(obj, { token, refreshToken }, context) {
      return refreshTokens(token, refreshToken, context.User, context.SECRET);
    }
  },
  Subscription: {}
});
