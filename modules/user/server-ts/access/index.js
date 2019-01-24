import jwt from './jwt';
import firebaseJwt from './firebase-jwt';
import session from './session';

import AccessModule from './AccessModule';

import settings from '../../../../settings';
// Try to grant access via sessions first, and if that fails, then try using JWT
// This way if both JWT and sessions enabled UI won't have to refresh access tokens
export default new AccessModule(session, settings.user.auth.firebase.enabled ? firebaseJwt : jwt);
