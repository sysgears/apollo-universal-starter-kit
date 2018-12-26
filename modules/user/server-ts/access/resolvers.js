import { withFilter } from 'graphql-subscriptions';

const LOGOUT_FROM_ALL_DEVICES = 'logout_from_all_devices_sub';

export default pubsub => ({
  Subscription: {
    logoutFromAllDevicesSub: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(LOGOUT_FROM_ALL_DEVICES),
        (payload, variables) => {
          return payload.logoutFromAllDevicesSub.userId === variables.userId;
        }
      )
    }
  }
});
