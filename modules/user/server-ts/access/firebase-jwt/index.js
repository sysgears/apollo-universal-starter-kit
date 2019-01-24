import firebase from 'firebase-admin';
import 'firebase/auth';
// import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-errors';

// import createTokens from './createToken';
import resolvers from './resolvers';
import schema from './schema.graphql';
import AccessModule from '../AccessModule';
import settings from '../../../../../settings';

const grant = async ({ token }) => {
  return token;
};

const getCurrentUser = async ({ req }) => {
  const authorization = req && req.headers['authorization'];
  const parts = authorization && authorization.split(' ');
  const token = parts && parts.length === 2 && parts[1];
  if (token) {
    const { uid } = await firebase.auth().verifyIdToken(token);
    const user = await firebase.auth().getUser(uid);
    return user;
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
  settings.user.auth.access.jwt.enabled
    ? {
        grant: [grant],
        schema: [schema],
        createResolversFunc: [resolvers],
        createContextFunc: [createContextFunc]
      }
    : {}
);
