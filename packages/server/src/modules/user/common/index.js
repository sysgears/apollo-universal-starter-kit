import Feature from '../../connector';
import schema from './schema.graphql';
import resolvers from './resolvers';

export default new Feature({
  schema,
  resolvers
});
