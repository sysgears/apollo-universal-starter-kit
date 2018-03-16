import schema from './schema.graphql';
import resolvers from './resolvers';
import Feature from '../connector';

export default new Feature({
  schema,
  createResolversFunc: resolvers
});
