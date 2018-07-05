import schema from './schema.graphql';
import resolvers from './resolvers';
import Feature from '../connector';
import settings from '../../../../../../../settings';

export default new Feature(
  settings.user.auth.password.enabled
    ? {
        schema,
        createResolversFunc: resolvers
      }
    : {}
);
