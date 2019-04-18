import { GraphQLModule } from '@gqlapp/graphql-server-ts';

import Counter from './sql';
import schema from './schema.graphql';
import createResolvers from './resolvers';

export default new GraphQLModule({
  schema: [schema],
  createResolversFunc: [createResolvers],
  createContextFunc: [() => ({ Counter: new Counter() })]
});
