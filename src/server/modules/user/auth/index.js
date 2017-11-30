import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import settings from '../../../../../settings';
import FieldError from '../../../../common/FieldError';

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

const hmac = (val, macKey) => {
  return crypto
    .createHmac('sha256', Buffer.from(macKey, 'utf-8'))
    .update(val)
    .digest('base64');
};

export const getSession = (req, macKey) => {
  const value = req.universalCookies.get('session', { doNotParse: true });
  const result = decodeSession(value, macKey);
  // console.log('getSession', result);
  return result;
};

export const decodeSession = (session, macKey) => {
  let result;
  if (session) {
    const str = session.slice(0, session.lastIndexOf('.'));
    const valMac = session.slice(session.lastIndexOf('.') + 1);
    const mac = hmac(str, macKey);
    result = valMac !== mac ? undefined : JSON.parse(str);
  }

  return result;
};

export const encodeSession = (session, macKey) => {
  const str = JSON.stringify(session);
  return str + '.' + hmac(str, macKey);
};

export const updateSession = (req, macKey, value) => {
  // console.log('updateSession', value);
  req.universalCookies.set('session', encodeSession(value, macKey), {
    httpOnly: true,
    secure: !__DEV__,
    maxAge: 7 * 24 * 3600
  });
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

  const session = { ...context.session, userId: user.id, forClient: false };
  updateSession(context.req, context.SECRET, session);
  context.session = session;

  return {
    session: encodeSession({ ...session, forClient: true }, context.SECRET),
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
