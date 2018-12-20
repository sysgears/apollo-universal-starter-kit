const LOGOUT_FROM_ALL_DEVICES = 'logout_from_all_devices_sub';

export default pubsub => ({
  Subscription: {
    logoutFromAllDevicesSub: {
      subscribe: () => pubsub.asyncIterator(LOGOUT_FROM_ALL_DEVICES)
    }
  }
});
