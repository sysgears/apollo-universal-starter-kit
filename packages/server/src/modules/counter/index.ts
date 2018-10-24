import Counter from './sql';

import schema from './schema.graphql';
import createResolvers from './resolvers';
import ServerModule from '../ServerModule';

export default new ServerModule({
  schema: [schema],
  createResolversFunc: [createResolvers as any],
  createContextFunc: [() => ({ Counter: new Counter() })]
});
