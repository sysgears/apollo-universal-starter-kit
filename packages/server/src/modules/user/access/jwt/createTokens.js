import jwt from 'jsonwebtoken';
import { pick } from 'lodash';

const createTokens = async (user, secret, refreshSecret) => {
  let tokenUser = pick(user, ['id', 'username', 'role']);
  tokenUser.fullName = user.firstName ? `${user.firstName} ${user.lastName}` : null;

  const createToken = jwt.sign(
    {
      user: tokenUser
    },
    secret,
    {
      expiresIn: '5s'
    }
  );

  const createRefreshToken = jwt.sign(
    {
      user: user.id
    },
    refreshSecret,
    {
      expiresIn: '7d'
    }
  );

  return Promise.all([createToken, createRefreshToken]);
};

export default createTokens;
