import { writeSession } from './sessions';
import User from '../../sql';
import settings from '../../../../../../../settings';

export default () => ({
  Mutation: {
    logout(obj, args, { req }) {
      const session = { ...req.session };

      delete session.userId;

      req.session = writeSession(req, session);
    },
    async logoutFromAllDevices(obj, args, { req }) {
      const session = { ...req.session };

      if (!settings.user.auth.access.jwt) {
        await User.increaseAuthSalt(session.userId);
      }

      delete session.userId;
      delete session.authSalt;

      req.session = writeSession(req, session);
    }
  }
});
