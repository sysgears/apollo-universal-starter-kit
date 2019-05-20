import ServerModule from '@gqlapp/module-server-ts';

import Post from './sql';
import schema from './schema';
import createResolvers from './resolvers';

export default new ServerModule({
  schema: [schema],
  createResolversFunc: [createResolvers],
  createContextFunc: [() => ({ Post: new Post() })]
});
