import jwt from 'jsonwebtoken';
import { pick } from 'lodash';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import settings from '../../../../../../../../settings';
import FieldError from '../../../../../../../common/FieldError';

export const establishSession = async (req, macKey) => {
  let session = getSession(req, macKey);
  if (!session) {
    crypto.randomBytes(16, (err, buf) => {
      if (err) throw err;
      const sessionID = buf.toString('hex');
      session = { sessionID };
      updateSession(req, macKey, session);
    });
  }
  return session;
};

const hmac = (val, macKey) =>
  crypto
    .createHmac('sha256', macKey)
    .update(val)
    .digest('base64');

export const getSession = (req, macKey) => {
  const value = req.universalCookies.get('session', { doNotParse: true });
  const str = value.slice(0, value.lastIndexOf('.'));
  const valMac = value.slice(value.lastIndexOf('.'));
  const mac = hmac(str, macKey);
  const result = valMac !== mac ? undefined : JSON.parse(str);

  console.log('getSession', result);
  return result;
};

export const updateSession = (req, macKey, value) => {
  console.log('updateSession', value);
  const str = JSON.stringify(value);
  req.universalCookies.set('session', str + '.' + hmac(str, macKey), { httpOnly: true, secure: !__DEV__ });
};

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

export const tryLogin = async (email, password, User, SECRET) => {
  const e = new FieldError();
  const user = await User.getUserByEmail(email);

  // check if email and password exist in db
  if (!user || user.password === null) {
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
    tokens: {
      token,
      refreshToken
    },
    user
  };
};

export const tryLoginSerial = async (serial, User, SECRET) => {
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
    console.log(err);
    return {};
  }
};
