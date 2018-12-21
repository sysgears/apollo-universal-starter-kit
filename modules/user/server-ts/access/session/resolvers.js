import { writeSession } from './sessions';
import User from '../../sql';
import settings from '../../../../../settings';

const LOGOUT_FROM_ALL_DEVICES = 'logout_from_all_devices_sub';

export default pubsub => ({
  Mutation: {
    logout(obj, args, { req }) {
      const session = { ...req.session };

      delete session.userId;

      req.session = writeSession(req, session);
    },
    async logoutFromAllDevices(obj, args, { req }) {
      const session = { ...req.session };

      if (!settings.user.auth.access.jwt.enabled) {
        await User.increaseAuthSalt(session.userId);
        pubsub.publish(LOGOUT_FROM_ALL_DEVICES, {
          logoutFromAllDevicesSub: {
            mutation: 'LOGOUT_FROM_ALL_DEVICES',
            userId: session.userId
          }
        });
      }

      delete session.userId;
      delete session.authSalt;

      req.session = writeSession(req, session);
    }
  }
});
