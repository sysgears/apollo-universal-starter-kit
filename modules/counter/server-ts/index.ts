import ServerModule from '@gqlapp/module-server-ts';

import Counter from './sql';
import schema from './schema.graphql';
import createResolvers from './resolvers';

export default new ServerModule({
  schema: [schema],
  createResolversFunc: [createResolvers],
  createContextFunc: [() => ({ Counter: new Counter() })]
});
