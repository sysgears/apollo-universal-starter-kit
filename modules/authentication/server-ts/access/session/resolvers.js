import { withFilter } from 'graphql-subscriptions';
import { writeSession } from './sessions';

const LOGOUT_SUBSCRIPTION = 'LOGOUT_SUBSCRIPTION';

export default pubsub => ({
  Mutation: {
    logout(obj, args, { req }) {
      const session = { ...req.session };
      delete session.id;
      delete session.authSalt;

      req.session = writeSession(req, session);
    },
    async logoutFromAllDevices(obj, { deviceId }, { req, updateAuthSalt }) {
      const session = { ...req.session };

      await updateAuthSalt(session.id);

      pubsub.publish(LOGOUT_SUBSCRIPTION, {
        deviceId,
        id: session.id
      });

      req.session = writeSession(req, { ...session, authSalt: session.authSalt + 1 });
    }
  },
  Subscription: {
    subscriptionLogoutFromAllDevices: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(LOGOUT_SUBSCRIPTION),
        (payload, variables) => {
          const { deviceId: pDeviceId, id: pId } = payload;
          const {
            input: { deviceId: vDeviceId, id: vId }
          } = variables;

          return pId === vId && pDeviceId !== vDeviceId;
        }
      )
    }
  }
});
