import crypto from 'crypto';
import log from '../../../../../../common/log';

import { encryptSession, decryptSession } from './crypto';

export const createSession = req => {
  const session = writeSession(req, { csrfToken: crypto.randomBytes(16).toString('hex') });
  return session;
};

export const readSession = req => {
  let session = decryptSession(req.universalCookies.get('session', { doNotParse: true }));
  if (req.headers.session) {
    session = decryptSession(req.headers.session);
  }
  if (__DEV__) {
    log.debug('read session', session);
  }
  return session;
};

export const writeSession = (req, session) => {
  req.universalCookies.set('session', encryptSession(session), {
    httpOnly: true,
    secure: !__DEV__,
    maxAge: 7 * 24 * 3600,
    path: '/'
  });
  if (__DEV__) {
    log.debug('write session', session);
  }

  return session;
};
