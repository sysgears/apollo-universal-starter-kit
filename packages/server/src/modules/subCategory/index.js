import SubCategory from './sql';
import schema from './schema.graphql';
import createResolvers from './resolvers';
import Feature from '../connector';

export default new Feature({
  schema: schema,
  createResolversFunc: createResolvers,
  createContextFunc: () => ({ SubCategory: new SubCategory() })
});
