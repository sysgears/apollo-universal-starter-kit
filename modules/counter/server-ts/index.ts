import { GraphQLServerModule } from '@gqlapp/graphql-server-ts';

import Counter from './sql';
import schema from './schema.graphql';
import createResolvers from './resolvers';

export default new GraphQLServerModule({
  schema: [schema],
  createResolversFunc: [createResolvers],
  createContextFunc: [() => ({ Counter: new Counter() })]
});
