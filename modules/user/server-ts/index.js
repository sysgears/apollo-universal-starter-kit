import ServerModule from '@module/module-server-ts';
import firebase from 'firebase-admin';

import access from './access';
import auth from './auth';
import confirmMiddleware from './confirm';
import schema from './schema.graphql';
import resolvers from './resolvers';
import resolversFirebase from './resolvers.firebase';
import scopes from './scopes';
import settings from '../../../settings';
import User from './sql';
import resources from './locales';
import serviceAccount from '../../../packages/server/firebase-admin-sdk-data.json';

const createContextFunc = async ({ context: { user } }) => ({
  User,
  user,
  auth: {
    isAuthenticated: !!user,
    scope: user ? scopes[user.role] : null
  }
});

const middleware = app => {
  if (settings.user.auth.password.sendConfirmationEmail) {
    app.get('/confirmation/:token', confirmMiddleware);
  }
};

if (settings.user.auth.firebase.enabled) {
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: process.env.DB_FIREBASE
  });
}

export { User };

export default new ServerModule(access, auth, {
  schema: [schema],
  createResolversFunc: settings.user.auth.firebase.enabled ? [resolversFirebase] : [resolvers],
  createContextFunc: [createContextFunc],
  middleware: [middleware],
  localization: [{ ns: 'user', resources }]
});
