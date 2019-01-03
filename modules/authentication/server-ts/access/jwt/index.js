import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-errors';

import createTokens from './createTokens';
import resolvers from './resolvers';
import schema from './schema.graphql';
import AccessModule from '../AccessModule';
import settings from '../../../../../settings';
import { MESSAGE_APPEND_CONTEXT } from '../errorMessages';

const grant = async identity => {
  const refreshSecret = settings.auth.secret + identity.passwordHash;
  const [accessToken, refreshToken] = await createTokens(identity, settings.auth.secret, refreshSecret);

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

const createContextFunc = async ({ req, context }) => {
  try {
    const { appendContext } = context;

    if (!appendContext) {
      throw new Error(MESSAGE_APPEND_CONTEXT);
    }

    const identity = context.identity || (await getCurrentIdentity({ req }));

    return {
      identity,
      ...appendContext(identity)
    };
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
