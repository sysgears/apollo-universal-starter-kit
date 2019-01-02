import jwt from 'jsonwebtoken';
import { pick } from 'lodash';
import { AuthenticationError } from 'apollo-server-errors';
import settings from '../../../../../settings';

const { tokenExpiresIn, refreshTokenExpiresIn } = settings.auth.jwt;
const MESSAGE_WITHOUT_ID = 'Error: Identity must have "id" method.';

const createTokens = async (identity, secret, refreshSecret) => {
  if (!identity.id) {
    throw new AuthenticationError(MESSAGE_WITHOUT_ID);
  }

  const tokenIdentity = pick(identity, ['id', 'username', 'role']);
  const createToken = jwt.sign({ id: tokenIdentity }, secret, { expiresIn: tokenExpiresIn });
  const createRefreshToken = jwt.sign({ id: identity.id }, refreshSecret, { expiresIn: refreshTokenExpiresIn });

  return Promise.all([createToken, createRefreshToken]);
};

export default createTokens;
