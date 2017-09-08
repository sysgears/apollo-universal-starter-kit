import jwt from 'jsonwebtoken';
import { pick } from 'lodash';
import bcrypt from 'bcryptjs';

import FieldError from '../../../common/error';

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
    secret,
    {
      expiresIn: '7d',
    },
  );

  return Promise.all([createToken, createRefreshToken]);
};

export const refreshTokens = async (token, refreshToken, User, SECRET) => {
  let userId = -1;
  try {
    const { user } = jwt.verify(refreshToken, SECRET);
    userId = user;
  } catch (err) {
    return {};
  }

  const user = await User.getUser(userId);

  const [newToken, newRefreshToken] = await createTokens(user, SECRET);
  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user,
  };
};

export const tryLogin = async (email, password, User, SECRET) => {
  const e = new FieldError();
  const localAuth = await User.getLocalOuthByEmail(email);

  if (!localAuth) {
    // user with provided email not found
    e.setError('email', 'Please enter a valid e-mail.');
  }

  const valid = await bcrypt.compare(password, localAuth.password);
  if (!valid) {
    // bad password
    e.setError('password', 'Please enter a valid password.');
  }

  e.throwIf();

  const user = await User.getUser(localAuth.userId);

  const [token, refreshToken] = await createTokens(user, SECRET);

  return {
    token,
    refreshToken,
  };
};
