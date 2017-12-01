import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import settings from '../../../../../settings';
import FieldError from '../../../../common/FieldError';
import { decryptSession, encryptSession } from './crypto';

export const createSession = req => {
  const session = updateSession(req, { sessionID: crypto.randomBytes(16).toString('hex') });
  // console.log(`createSession: ${JSON.stringify(session)}`);
  return session;
};

export const readSession = req => {
  const session = decryptSession(req.universalCookies.get('session', { doNotParse: true }));
  // console.log(`readSession: ${JSON.stringify(session)}`);
  return session;
};

export const updateSession = (req, session) => {
  req.universalCookies.set('session', encryptSession(session), {
    httpOnly: true,
    secure: !__DEV__,
    maxAge: 7 * 24 * 3600
  });

  // console.log(`updateSession: ${JSON.stringify(session)}`);
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
