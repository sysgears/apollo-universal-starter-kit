import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-errors';

import settings from '@gqlapp/config';

const { tokenExpiresIn, refreshTokenExpiresIn } = settings.auth.jwt;

const createTokens = async (identity, secret, refreshSecret, t) => {
  if (!identity.id) {
    throw new AuthenticationError(t('auth:identityWithoutId'));
  }

  const createToken = jwt.sign({ identity }, secret, { expiresIn: tokenExpiresIn });
  const createRefreshToken = jwt.sign({ id: identity.id }, refreshSecret, { expiresIn: refreshTokenExpiresIn });

  return Promise.all([createToken, createRefreshToken]);
};

export default createTokens;
