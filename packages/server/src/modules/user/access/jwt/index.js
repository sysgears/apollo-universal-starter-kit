import jwt from 'jsonwebtoken';

import createTokens from './createTokens';
import resolvers from './resolvers';
import schema from './schema.graphql';
import Feature from '../connector';
import settings from '../../../../../../../settings';
import scopes from '../../scopes';
import UserDAO from '../../sql';

const User = new UserDAO();
const grant = async user => {
  const refreshSecret = settings.user.secret + user.passwordHash;
  const [accessToken, refreshToken] = await createTokens(user, settings.user.secret, refreshSecret);

  return {
    accessToken,
    refreshToken
  };
};

const getCurrentUser = async ({ req }) => {
  const authorization = req && req.headers['authorization'];
  const parts = authorization && authorization.split(' ');
  const token = parts && parts.length === 2 && parts[1];
  if (token) {
    try {
      const { user } = jwt.verify(token, settings.user.secret);
      return user;
    } catch (e) {
      return undefined;
    }
  }
};

const createContextFunc = async (req, res, connectionParams, webSocket, context) => {
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

export default new Feature(
  settings.user.auth.access.jwt.enabled
    ? {
        grant,
        schema,
        createResolversFunc: resolvers,
        createContextFunc
      }
    : {}
);
