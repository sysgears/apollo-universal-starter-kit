import ServerModule from '@module/module-server-ts';

import confirmMiddleware from './confirm';
import schema from './schema.graphql';
import resolvers from './resolvers';
import scopes from './scopes';
import settings from '../../../settings';
import User from './sql';
import resources from './locales';
import social from './social';

const getIdentity = async id => await User.getUser(id);
const getHash = async id => (await User.getUserWithPassword(id)) || '';

const createContextFunc = async () => ({
  getIdentity,
  getHash,
  User
});

const middleware = app => {
  if (settings.user.auth.password.sendConfirmationEmail) {
    app.get('/confirmation/:token', confirmMiddleware);
  }
};

export { User, scopes };
export default new ServerModule(social, {
  schema: [schema],
  createResolversFunc: [resolvers],
  createContextFunc: [createContextFunc],
  middleware: [middleware],
  localization: [{ ns: 'user', resources }]
});
