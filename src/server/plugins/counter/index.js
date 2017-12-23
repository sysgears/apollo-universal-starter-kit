import Counter from './sql';

import schema from './schema.graphql';
import createResolvers from './resolvers';
import Plugin from '../connector';

export default new Plugin({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: () => ({ Counter: new Counter() })
});
