import crypto from 'crypto';

import { encryptSession, decryptSession } from './crypto';

export const createSession = req => {
  const session = updateSession(req, { csrfToken: crypto.randomBytes(16).toString('hex') });
  return session;
};

export const readSession = req => {
  let session = decryptSession(req.universalCookies.get('session', { doNotParse: true }));
  if (req.headers.session) {
    session = decryptSession(req.headers.session);
  }
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
