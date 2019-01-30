import { writeSession, createSession, readSession } from './sessions';
import AccessModule from '../AccessModule';
import schema from './schema.graphql';
import resolvers from './resolvers';
import scopes from '../../scopes';
import User from '../../sql';
import settings from '../../../../../settings';

const grant = async (token, req) => {
  req.session = await writeSession(req, token);
};

const getCurrentUser = async ({ req }) => {
  if (req && req.session) {
    return await User.getUserByEmail(req.session);
  }
};

const attachSession = async req => {
  if (req) {
    req.session = await readSession(req);
    if (!req.session) {
      req.session = await createSession(req);
    }
  }
};

const createContextFunc = async ({ req, connectionParams, webSocket, context }) => {
  await attachSession(req);
  const user = context.user || (await getCurrentUser({ req, connectionParams, webSocket }));
  const auth = {
    isAuthenticated: !!user,
    scope: user ? scopes[user.role] : null
  };

  return {
    User,
    user,
    auth
  };
};

export default new AccessModule(
  settings.user.auth.firebase.session
    ? {
        grant: [grant],
        schema: [schema],
        createResolversFunc: [resolvers],
        createContextFunc: [createContextFunc]
      }
    : {}
);
