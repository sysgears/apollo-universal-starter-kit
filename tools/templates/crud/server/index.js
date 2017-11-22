import GraphQLGenerator from 'domain-graphql';

import { $Module$ as $Module$Schema } from './schema';
import $Module$ from './sql';
import schema from './schema.graphqls';
import createResolvers from './resolvers';
import Feature from '../connector';

export default new Feature({
  schema: [schema, new GraphQLGenerator().generateTypes($Module$Schema)],
  createResolversFunc: createResolvers,
  createContextFunc: () => ({ $Module$: new $Module$() })
});
