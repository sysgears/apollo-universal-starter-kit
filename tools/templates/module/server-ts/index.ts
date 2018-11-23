import ServerModule from '@module/module-server-ts';

import schema from './schema.graphql';
import createResolvers from './resolvers';
import $Module$ from './sql';

export default new ServerModule({
  schema: [schema],
  createResolversFunc: [createResolvers],
  createContextFunc: [() => ({ $Module$: new $Module$() })]
});
