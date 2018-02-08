import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import settings from '../../../../../../../../settings';
import FieldError from '../../../../../../../common/FieldError';
import { decryptSession, encryptSession } from './crypto';

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

export const createSession = req => {
  const session = updateSession(req, { csrfToken: crypto.randomBytes(16).toString('hex') });
  return session;
};

export const readSession = req => {
  const session = decryptSession(req.universalCookies.get('session', { doNotParse: true }));
  return session;
};

export const updateSession = (req, session) => {
  req.universalCookies.set('session', encryptSession(session), {
    httpOnly: true,
    secure: !__DEV__,
    maxAge: 7 * 24 * 3600
  });
  return session;
};

export const tryLogin = async (email, password, context) => {
  const e = new FieldError();
  const user = await context.User.getUserByEmail(email);

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
  return {
    user
  };
};

export const tryLoginSerial = async (serial, User) => {
  try {
    const certAuth = await User.getUserWithSerial(serial);

    const user = await User.getUserWithPassword(certAuth.id);

    return {
      user
    };
  } catch (err) {
    console.log(err);
    return {};
  }
};
