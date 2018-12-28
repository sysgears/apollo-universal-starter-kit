import { writeSession } from './sessions';

export default () => ({
  Mutation: {
    logout(obj, args, { req }) {
      const session = { ...req.session };

      delete session.id;

      req.session = writeSession(req, session);
    }
  }
});
