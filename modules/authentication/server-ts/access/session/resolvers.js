import { withFilter } from 'graphql-subscriptions';
import { writeSession } from './sessions';

const LOGOUT_SUBSCRIPTION = 'LOGOUT_SUBSCRIPTION';

export default pubsub => ({
  Mutation: {
    logout(obj, args, { req }) {
      const session = { ...req.session };
      delete session.id;

      req.session = writeSession(req, session);
    },
    async logoutFromAllDevices(obj, args, { req, updateAuthSalt }) {
      const session = { ...req.session };

      await updateAuthSalt(session.id);

      pubsub.publish(LOGOUT_SUBSCRIPTION, { session });

      req.session = writeSession(req, { ...session, authSalt: session.authSalt + 1 });
    }
  },
  Subscription: {
    subscriptionLogoutFromAllDevices: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(LOGOUT_SUBSCRIPTION),
        () => {
          return true;
        }
      )
    }
  }
});
