import ServerModule from '@gqlapp/module-server-ts';
import settings from '@gqlapp/config';

import confirmMiddleware from './confirm';
import schema from './schema.graphql';
import resolvers from './resolvers';
import scopes from './scopes';
import User from './sql';
import resources from './locales';
import social from './social';
import password from './password';

const getIdentity = (id, serial = '') => {
  if (!id && serial) {
    return User.getUserWithSerial(serial);
  }

  return User.getUser(id);
};

const getHash = async id => (await User.getUserWithPassword(id)).passwordHash || '';

const createContextFunc = ({ req }) => ({
  User,
  auth: {
    isAuthenticated: req && req.identity,
    scope: req && req.identity && req.identity.role ? scopes[req.identity.role] : null
  },
  getIdentity,
  getHash
});

const appContext = {
  getIdentity,
  getHash
};

const middleware = app => {
  if (settings.auth.password.requireEmailConfirmation) {
    app.get('/confirmation/:token', confirmMiddleware);
  }
};

export default new ServerModule(social, password, {
  schema: [schema],
  appContext,
  createResolversFunc: [resolvers],
  createContextFunc: [createContextFunc],
  middleware: [middleware],
  localization: [{ ns: 'user', resources }]
});
