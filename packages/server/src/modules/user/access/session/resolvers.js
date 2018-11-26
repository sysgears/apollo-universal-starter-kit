import { writeSession } from './sessions';
import User from '../../sql';

export default () => ({
  Mutation: {
    logout(obj, args, { req }) {
      const session = { ...req.session };

      delete session.userId;

      req.session = writeSession(req, session);
    },
    async logoutFromAllDevices(obj, args, { req }) {
      const session = { ...req.session };

      await User.deleteUserSessions(session.userId);
      delete session.userId;

      req.session = writeSession(req, session);
    }
  }
});
