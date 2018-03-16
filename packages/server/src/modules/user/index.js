import access from './access';
import auth from './auth';
import confirmMiddleware from './confirm';
import schema from './schema.graphql';
import resolvers from './resolvers';
import settings from '../../../../../settings';

import Feature from '../connector';

export default new Feature(access, auth, {
  schema,
  createResolversFunc: resolvers,
  middleware: app => {
    if (settings.user.auth.password.sendConfirmationEmail) {
      app.get('/confirmation/:token', confirmMiddleware);
    }
  }
});
