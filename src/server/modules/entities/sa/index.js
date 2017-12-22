import schema from './schema.graphql';
import createResolvers from './resolvers';
import Feature from '../../connector';

import ServiceAccount from './lib';

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: () => ({ ServiceAccount: ServiceAccount() })
});
