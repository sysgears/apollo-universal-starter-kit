import Counter from './sql';

import schema from './schema.graphql';
import createResolvers from './resolvers';
import ServerModule from '@module/module-server-ts';

export default new ServerModule({
  schema: [schema],
  createResolversFunc: [createResolvers],
  createContextFunc: [() => ({ Counter: new Counter() })]
});
