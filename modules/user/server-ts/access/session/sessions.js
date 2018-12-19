import crypto from 'crypto';
import { log } from '@module/core-common';

import { encryptSession, decryptSession } from './crypto';

export const createSession = req => {
  const session = writeSession(req, { csrfToken: crypto.randomBytes(16).toString('hex') });
  return session;
};

export const readSession = req => {
  let session;
  if (__TEST__) {
    session = global.__TEST_SESSION__;
    if (session) {
      req.universalCookies.set('x-token', session.csrfToken);
    }
  } else {
    session = decryptSession(req.universalCookies.get('session', { doNotParse: true }));
    if (req.headers.session) {
      session = decryptSession(req.headers.session);
    }
  }
  if (__DEV__) {
    log.debug('read session', session);
  }
  return session;
};

export const writeSession = (req, session) => {
  if (__TEST__) {
    global.__TEST_SESSION__ = session;
  } else {
    const cookieParams = {
      httpOnly: true,
      maxAge: 7 * 24 * 3600,
      path: '/'
    };
    req.universalCookies.set('session', encryptSession(session), cookieParams);
    req.universalCookies.set('x-token', session.csrfToken, cookieParams);
  }
  if (__DEV__) {
    log.debug('write session', session);
  }

  return session;
};
