import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { pick } from 'lodash';
import settings from '../../../../../settings';
import FieldError from '../../../../common/FieldError';
import log from '../../../../common/log';

export const createTokens = async (user: any, secret: string, refreshSecret: string) => {
  const createToken = jwt.sign({ user: pick(user, ['id', 'username', 'role']) } as any, secret, { expiresIn: '1m' });

  const createRefreshToken = jwt.sign({ user: user.id } as any, refreshSecret, { expiresIn: '7d' });

  return Promise.all([createToken, createRefreshToken]);
};

export const refreshTokens = async (token: string, refreshToken: string, User: any, SECRET: string) => {
  let userId = -1;
  try {
    userId = (jwt.decode(refreshToken) as any).user;
  } catch (err) {
    return {};
  }

  const user = await User.getUserWithPassword(userId);
  if (!user) {
    return {};
  }
  const refreshSecret = SECRET + user.password;

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

export const tryLogin = async (email: string, password: string, User: any, SECRET: string) => {
  const e = new FieldError();
  const user = await User.getUserByEmail(email);

  // check if email and password exist in db
  if (!user || user.password == null) {
    // user with provided email not found
    e.setError('email', 'Please enter a valid e-mail.');
    e.throwIf();
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    // bad password
    e.setError('password', 'Please enter a valid password.');
    e.throwIf();
  }

  if (settings.user.auth.password.confirm && !user.isActive) {
    e.setError('email', 'Please confirm your e-mail first.');
    e.throwIf();
  }

  const refreshSecret = SECRET + user.password;

  const [token, refreshToken] = await createTokens(user, SECRET, refreshSecret);

  return {
    token,
    refreshToken
  };
};

export const tryLoginSerial = async (serial: string, User: any, SECRET: string) => {
  try {
    const certAuth = await User.getUserWithSerial(serial);

    const user = await User.getUserWithPassword(certAuth.id);

    const refreshSecret = SECRET + user.password;
    const [token, refreshToken] = await createTokens(user, SECRET, refreshSecret);

    return {
      user,
      token,
      refreshToken
    };
  } catch (err) {
    log.error(err.stack);
    return {};
  }
};
