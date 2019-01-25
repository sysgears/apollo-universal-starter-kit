import ServerModule from '@gqlapp/module-server-ts';

import access from './access';
import auth from './auth';
import schema from './schema.graphql';
import resolvers from './resolvers';
import scopes from './scopes';
import User from './sql';
import resources from './locales';

const createContextFunc = async ({ context: { user } }) => ({
  User,
  user,
  auth: {
    isAuthenticated: !!user,
    scope: user ? scopes[user.role] : null
  }
});

export { User };

export default new ServerModule(access, auth, {
  schema: [schema],
  createResolversFunc: [resolvers],
  createContextFunc: [createContextFunc],
  localization: [{ ns: 'user', resources }]
});
