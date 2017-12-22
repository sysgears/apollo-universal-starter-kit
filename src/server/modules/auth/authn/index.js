import schema from './schema.graphql';
import createResolvers from './resolvers';
import Feature from '../../connector';

import Authn from './lib';

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: () => ({ Authn: new Authn() })
});
