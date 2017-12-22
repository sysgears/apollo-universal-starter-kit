import schema from './schema.graphql';
import createResolvers from './resolvers';
import Feature from '../../connector';

import Org from './lib';

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: () => ({ Org: new Org() })
});
