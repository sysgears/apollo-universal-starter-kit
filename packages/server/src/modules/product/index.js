import Product from './sql';
import schema from './schema.graphql';
import createResolvers from './resolvers';
import Feature from '../connector';

export default new Feature({
  schema: schema,
  createResolversFunc: createResolvers,
  createContextFunc: () => ({ Product: new Product() })
});
