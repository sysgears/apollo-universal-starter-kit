import jwt from 'jsonwebtoken';
import { pick } from 'lodash';

import settings from '../../../../../settings';

const createTokens = async (user, secret, refreshSecret) => {
  let tokenUser = pick(user, ['id', 'username', 'role']);
  tokenUser.fullName = user.firstName ? `${user.firstName} ${user.lastName}` : null;

  const createToken = jwt.sign(
    {
      user: tokenUser
    },
    secret,
    {
      expiresIn: settings.auth.jwt.tokenExpiresIn
    }
  );

  const createRefreshToken = jwt.sign(
    {
      user: user.id
    },
    refreshSecret,
    {
      expiresIn: settings.auth.jwt.refreshTokenExpiresIn
    }
  );

  return Promise.all([createToken, createRefreshToken]);
};

export default createTokens;
