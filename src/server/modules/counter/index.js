import Count from './sql';

import schema from './schema.graphqls';
import createResolvers from './resolvers';
import subscriptionsSetup from './subscriptions_setup';
import Feature from '../connector';

export default new Feature({schema, createResolversFunc: createResolvers, subscriptionsSetup,
  createContextFunc: () => ({ Count: new Count() })});
