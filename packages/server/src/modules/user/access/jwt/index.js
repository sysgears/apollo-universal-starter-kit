import jwt from 'jsonwebtoken';

import { createTokens } from './tokens';
import resolvers from './resolvers';
import schema from './schema.graphql';
import Feature from '../connector';
import settings from '../../../../../../../settings';
import scopes from '../../scopes';
import UserDAO from '../../sql';

const User = new UserDAO();
const grant = async user => {
  const refreshSecret = settings.user.secret + user.passwordHash;
  const [token, refreshToken] = await createTokens(user, settings.user.secret, refreshSecret);

  return {
    token,
    refreshToken
  };
};

// Do nothing, revoking access should be done client-side
const revoke = async () => {};

const getCurrentUser = async ({ req }) => {
  const token = req && req.headers['x-token'];
  if (token) {
    const { user } = jwt.verify(token, settings.user.secret);
    req.user = user;
  }
};

const createContextFunc = async (req, res, connectionParams, webSocket) => {
  const user = await getCurrentUser({ req, connectionParams, webSocket });
  const auth = {
    isAuthenticated: !!user,
    scope: user ? scopes[user.role] : null
  };

  return {
    User,
    user,
    auth,
    req
  };
};

export default new Feature({
  grant,
  revoke,
  schema,
  createResolversFunc: resolvers,
  createContextFunc
});
