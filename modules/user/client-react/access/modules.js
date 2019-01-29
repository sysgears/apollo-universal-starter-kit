import jwt from './jwt';
import firebaseJwt from './firebase-jwt';
import session from './session';
// import firebaseSession from './firebase-session';

import settings from '../../../../settings';

const jwtModule = settings.user.auth.firebase.jwt ? firebaseJwt : jwt;
// const sessionModule = settings.user.auth.firebase.session ? firebaseSession : session;
const sessionModule = session;

export { jwtModule as jwt, sessionModule as session };
