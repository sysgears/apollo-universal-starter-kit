import ServerModule from '@module/module-server-ts';
// import firebase from 'firebase-admin';

import access from './access';
import auth from './auth';
import confirmMiddleware from './confirm';
import schema from './schema.graphql';
import resolvers from './resolvers';
import scopes from './scopes';
import settings from '../../../settings';
import User from './sql';
// import User from './firebase';
import resources from './locales';
// import serviceAccount from '../../../packages/server/firebase-admin-sdk-data.json';

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

// if (settings.user.auth.firebase.enabled) {
//   const firebasApp = firebase.initializeApp({
//     credential: firebase.credential.cert(serviceAccount)
//   });
//   firebasApp.firestore().settings({ timestampsInSnapshots: true });
// }

export { User };

export default new ServerModule(access, auth, {
  schema: [schema],
  createResolversFunc: [resolvers],
  createContextFunc: [createContextFunc],
  middleware: [middleware],
  localization: [{ ns: 'user', resources }]
});
