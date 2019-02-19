import Counter from './sql';

import schema from './schema.graphql';
import createResolvers from './resolvers';
import ServerModule from '@gqlapp/module-server-ts';

export default new ServerModule({
  schema: [schema],
  createResolversFunc: [createResolvers],
  createGraphQLContextFunc: [() => ({ Counter: new Counter() })]
});
