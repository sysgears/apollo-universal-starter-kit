import { GraphQLModule } from '@gqlapp/graphql-server-ts';

import Post from './sql';
import schema from './schema.graphql';
import createResolvers from './resolvers';

export default new GraphQLModule({
  schema: [schema],
  createResolversFunc: [createResolvers],
  createContextFunc: [() => ({ Post: new Post() })]
});
