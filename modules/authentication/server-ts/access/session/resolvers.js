import { writeSession } from './sessions';

export default () => ({
  Mutation: {
    logout(obj, args, { req }) {
      const session = { ...req.session };
      delete session.id;

      req.session = writeSession(req, session);
    },
    async logoutFromAllDevices(obj, args, { req, updateAuthSalt }) {
      const session = { ...req.session };

      await updateAuthSalt(session.id);

      req.session = writeSession(req, { ...session, authSalt: session.authSalt + 1 });
    }
  }
});
