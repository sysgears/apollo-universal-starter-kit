import ServerModule from '@gqlapp/module-server-ts';

import confirmMiddleware from './confirm';
import schema from './schema.graphql';
import resolvers from './resolvers';
import scopes from './scopes';
import settings from '../../../settings';
import User from './sql';
import resources from './locales';
import social from './social';

const appendContext = identity => ({
  auth: {
    isAuthenticated: !!identity,
    scope: identity && identity.role ? scopes[identity.role] : null
  }
});

const getIdentity = (id, serial = '') => {
  if (!id && serial) {
    return User.getUserWithSerial(serial);
  }

  return User.getUser(id);
};

const getHash = async id => (await User.getUserWithPassword(id)).passwordHash || '';

const createContextFunc = () => ({
  User
});

const context = {
  appendContext,
  getIdentity,
  getHash
};

const middleware = app => {
  if (settings.user.auth.password.sendConfirmationEmail) {
    app.get('/confirmation/:token', confirmMiddleware);
  }
};

export default new ServerModule(social, {
  schema: [schema],
  context,
  createResolversFunc: [resolvers],
  createContextFunc: [createContextFunc],
  middleware: [middleware],
  localization: [{ ns: 'user', resources }]
});
