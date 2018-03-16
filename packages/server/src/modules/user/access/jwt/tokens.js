import jwt from 'jsonwebtoken';
import { pick } from 'lodash';

export const createTokens = async (user, secret, refreshSecret) => {
  let tokenUser = pick(user, ['id', 'username', 'role']);
  tokenUser.fullName = user.firstName ? `${user.firstName} ${user.lastName}` : null;

  const createToken = jwt.sign(
    {
      user: tokenUser
    },
    secret,
    {
      expiresIn: '1m'
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

export const refreshTokens = async (token, refreshToken, User, SECRET) => {
  let userId = -1;
  try {
    const { user } = jwt.decode(refreshToken);
    userId = user;
  } catch (err) {
    return {};
  }

  const user = await User.getUserWithPassword(userId);
  if (!user) {
    return {};
  }
  const refreshSecret = SECRET + user.passwordHash;

  try {
    jwt.verify(refreshToken, refreshSecret);
  } catch (err) {
    return {};
  }

  const [newToken, newRefreshToken] = await createTokens(user, SECRET, refreshSecret);

  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user: pick(user, ['id', 'username', 'role'])
  };
};
