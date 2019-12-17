import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-errors';

import settings from '@gqlapp/config';

import createTokens from './createTokens';
import resolvers from './resolvers';
import schema from './schema.graphql';
import AccessModule from '../AccessModule';

const grant = async (identity, req, hash = '') => {
  const refreshSecret = settings.auth.secret + hash;
  const [accessToken, refreshToken] = await createTokens(identity, settings.auth.secret, refreshSecret, req.t);

  return {
    accessToken,
    refreshToken
  };
};

const getCurrentIdentity = async ({ req }) => {
  const authorization = req && req.headers['authorization'];
  const parts = authorization && authorization.split(' ');
  const token = parts && parts.length === 2 && parts[1];
  if (token) {
    const { identity } = jwt.verify(token, settings.auth.secret);
    return identity;
  }
};

const createContextFunc = async ({ req }) => {
  try {
    if (req) {
      req.identity = req.identity || (await getCurrentIdentity({ req }));
    }
  } catch (e) {
    throw new AuthenticationError(e);
  }
};

export default new AccessModule(
  settings.auth.jwt.enabled
    ? {
        grant: [grant],
        schema: [schema],
        createResolversFunc: [resolvers],
        createContextFunc: [createContextFunc]
      }
    : {}
);
