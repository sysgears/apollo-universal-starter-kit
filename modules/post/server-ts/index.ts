import ServerModule from '@gqlapp/module-server-ts';

import Post from './sql';
import schema from './schema.graphql';
import createResolvers from './resolvers';

export default new ServerModule({
  schema: [schema],
  createResolversFunc: [createResolvers],
  createContextFunc: [() => ({ Post: new Post() })]
});
