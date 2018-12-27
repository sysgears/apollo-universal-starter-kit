import jwt from 'jsonwebtoken';
import { pick } from 'lodash';

import settings from '../../../../../settings';

const { tokenExpiresIn, refreshTokenExpiresIn } = settings.auth.jwt;

const createTokens = async (identity, secret, refreshSecret) => {
  let tokenUser = pick(identity, ['id']);

  const createToken = jwt.sign({ identity: tokenUser }, secret, { expiresIn: tokenExpiresIn });

  const createRefreshToken = jwt.sign({ identity: identity.id }, refreshSecret, { expiresIn: refreshTokenExpiresIn });

  return Promise.all([createToken, createRefreshToken]);
};

export default createTokens;
