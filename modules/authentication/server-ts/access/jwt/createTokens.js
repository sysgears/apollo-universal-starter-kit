import jwt from 'jsonwebtoken';
import { pick } from 'lodash';
import { AuthenticationError } from 'apollo-server-errors';
import settings from '../../../../../settings';
import { MESSAGE_IDENTITY_WITHOUT_ID } from '../errorMessages';

const { tokenExpiresIn, refreshTokenExpiresIn } = settings.auth.jwt;

const createTokens = async (identity, secret, refreshSecret) => {
  if (!identity.id) {
    throw new AuthenticationError(MESSAGE_IDENTITY_WITHOUT_ID);
  }

  const tokenIdentity = pick(identity, ['id', 'username', 'role']);
  const createToken = jwt.sign({ identity: tokenIdentity }, secret, { expiresIn: tokenExpiresIn });
  const createRefreshToken = jwt.sign({ id: identity.id }, refreshSecret, { expiresIn: refreshTokenExpiresIn });

  return Promise.all([createToken, createRefreshToken]);
};

export default createTokens;
