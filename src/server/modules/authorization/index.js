import Feature from '../connector';

import schema from './schema';
import createResolvers from './resolvers';
import Authz from './lib';

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: () => ({ Authz })
});
