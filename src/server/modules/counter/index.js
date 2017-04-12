import Count from './sql';

import schema from './schema.graphqls';
import createResolvers from './resolvers';
import subscriptionsSetup from './subscriptions_setup';
import { addGraphQLSchema, addResolversFactory, addSubscriptionSetup, addContextFactory } from '../connector';

addGraphQLSchema(schema);
addResolversFactory(createResolvers);
addSubscriptionSetup(subscriptionsSetup);

addContextFactory(() => ({ Count: new Count() }));
