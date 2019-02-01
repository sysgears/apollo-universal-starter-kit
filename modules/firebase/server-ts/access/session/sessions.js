import firebase from 'firebase-admin';
import { log } from '@gqlapp/core-common';

export const createSession = req => {
  const session = writeSession(req);
  return session;
};

export const readSession = async req => {
  const sessionCookie = parse => req.universalCookies.get('session', { doNotParse: parse });
  let session;
  if (sessionCookie) {
    if (__TEST__) {
      session = global.__TEST_SESSION__;
    } else {
      try {
        session = await firebase.auth().verifySessionCookie(sessionCookie(true));
      } catch (e) {
        session = req.session;
      }
    }
    if (__DEV__) {
      log.debug('read session', session);
    }
  }
  return session ? session.email : session;
};

export const writeSession = async (req, token) => {
  let encryptSession;
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  if (token) {
    encryptSession = await firebase.auth().createSessionCookie(token, { expiresIn });
  }
  const session = encryptSession || req.session;
  if (__TEST__) {
    global.__TEST_SESSION__ = session;
  } else {
    const cookieParams = {
      httpOnly: true,
      maxAge: expiresIn,
      path: '/'
    };
    req.universalCookies.set('session', session, cookieParams);
  }
  if (__DEV__) {
    log.debug('write session', session);
  }

  return session;
};
