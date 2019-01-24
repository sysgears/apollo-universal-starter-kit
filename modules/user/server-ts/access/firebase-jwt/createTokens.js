import firebase from 'firebase-admin';
import 'firebase/auth';
import { pick } from 'lodash';

import settings from '../../../../../settings';

const createTokens = async user => {
  const { uid } = user;
  let tokenUser = pick(user, ['id', 'username', 'role']);

  const createToken = firebase
    .auth()
    .createCustomToken(uid, { user: tokenUser, expiresIn: settings.user.auth.access.jwt.tokenExpiresIn });

  const createRefreshToken = firebase
    .auth()
    .createCustomToken(uid, { expiresIn: settings.user.auth.access.jwt.refreshTokenExpiresIn });

  return Promise.all([createToken, createRefreshToken]);
};

export default createTokens;
