import jwt from 'jsonwebtoken';
import { pick } from 'lodash';
import bcrypt from 'bcryptjs';

export const createTokens = async (user, secret) => {
  const createToken = jwt.sign(
    {
      user: pick(user, ['id', 'username', 'isAdmin']),
    },
    secret,
    {
      expiresIn: '1m',
    },
  );

  const createRefreshToken = jwt.sign(
    {
      user: user.id,
    },
    secret + user,
    {
      expiresIn: '7d',
    },
  );

  return Promise.all([createToken, createRefreshToken]);
};

export const refreshTokens = async (token, refreshToken, User, SECRET) => {
  let userId = -1;
  try {
    const { user: { id } } = jwt.verify(refreshToken, SECRET);
    userId = id;
  } catch (err) {
    return {};
  }

  const user = await User.getUserWithPassword(userId);

  const [newToken, newRefreshToken] = await createTokens(user, SECRET);
  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user,
  };
};

export const tryLogin = async (email, password, User, SECRET) => {
  const localAuth = await User.getLocalOuthByEmail(email);

  if (!localAuth) {
    // user with provided email not found
    throw new Error('Invalid login');
  }

  const valid = await bcrypt.compare(password, localAuth.password);
  if (!valid) {
    // bad password
    throw new Error('Invalid login');
  }

  const user = await User.getUser(localAuth.userId);

  const [token, refreshToken] = await createTokens(user, SECRET);

  return {
    token,
    refreshToken,
  };
};
