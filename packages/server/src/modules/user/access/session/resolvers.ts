import { writeSession } from './sessions';
import * as models from '../../../../../typings/graphql';

interface Context {
  req: any;
}

export default (): {
  Mutation: models.MutationResolvers.Resolvers<Context>;
} => ({
  Mutation: {
    async logout(obj, args, { req }) {
      const session = { ...req.session };

      delete session.userId;

      req.session = writeSession(req, session);

      return session;
    }
  }
});
