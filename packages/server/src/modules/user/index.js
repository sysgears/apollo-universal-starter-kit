import access from './access';
import auth from './auth';
import confirmMiddleware from './confirm';
import schema from './schema.graphql';
import resolvers from './resolvers';
import scopes from './scopes';
import settings from '../../../../../settings';
import User from './sql';
import ServerModule from '../ServerModule';
import resources from './locales';

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

export default new ServerModule(access, auth, {
  schema: [schema],
  createResolversFunc: [resolvers],
  createContextFunc: [createContextFunc],
  middleware: [middleware],
  localization: [{ ns: 'user', resources }]
});
