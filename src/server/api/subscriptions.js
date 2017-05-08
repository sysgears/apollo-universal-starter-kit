import { SubscriptionManager } from 'graphql-subscriptions';

import schema, { pubsub } from './schema';
import modules from '../modules';
import { app as settings } from '../../../package.json';
import { addApolloLogging } from '../../common/apollo_logger';

const manager = new SubscriptionManager({
  schema,
  pubsub,
  setupFunctions: modules.subscriptionsSetups,
});
const subscriptionManager = settings.apolloLogging ? addApolloLogging(manager) : manager;

export { subscriptionManager, pubsub };
