import schema from './schema';
import createResolvers from './resolvers';
import Feature from '../../connector';

import Authz from './lib';

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: () => ({ Authz: new Authz() })
});
