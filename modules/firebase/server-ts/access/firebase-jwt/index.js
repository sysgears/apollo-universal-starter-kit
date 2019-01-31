import firebase from 'firebase-admin';
import 'firebase/auth';
import { AuthenticationError } from 'apollo-server-errors';

import AccessModule from '../AccessModule';
import settings from '../../../../../settings';
import User from '../../sql';

const grant = async token => {
  return token;
};

const getCurrentUser = async ({ req }) => {
  const authorization = req && req.headers['authorization'];
  const parts = authorization && authorization.split(' ');
  const token = parts && parts.length === 2 && parts[1];
  if (token) {
    const { email } = await firebase.auth().verifyIdToken(token);
    const { id, role } = await User.getUserByEmail(email);
    return { email, id, role };
  }
};

const createContextFunc = async ({ req, connectionParams, webSocket, context }) => {
  try {
    context.user = context.user || (await getCurrentUser({ req, connectionParams, webSocket }));
  } catch (e) {
    throw new AuthenticationError(e);
  }
};

export default new AccessModule(
  settings.user.auth.firebase.jwt
    ? {
        grant: [grant],
        schema: [],
        createResolversFunc: [],
        createContextFunc: [createContextFunc]
      }
    : {}
);
