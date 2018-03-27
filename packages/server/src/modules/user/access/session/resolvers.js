import { updateSession } from './sessions';

export default () => ({
  Mutation: {
    logout(obj, args, { req }) {
      const session = { ...req.session };

      delete session.userId;

      req.session = updateSession(req, session);
    }
  }
});
