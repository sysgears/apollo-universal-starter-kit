import { SubscriptionServer } from 'subscriptions-transport-ws';
import { SubscriptionManager } from 'graphql-subscriptions';
import { addApolloLogging } from 'apollo-logger';

import schema, { pubsub } from './schema';
import modules from '../modules';
import log from '../../common/log';
import { app as settings } from '../../../package.json';

const manager = new SubscriptionManager({
  schema,
  pubsub,
  setupFunctions: modules.subscriptionsSetups,
});
const subscriptionManager = settings.apolloLogging ? addApolloLogging(manager) : manager;

var subscriptionServer;

const addSubscriptions = httpServer => {
  let subscriptionServerConfig = {
    server: httpServer,
    path: '/graphql'
  };

  subscriptionServer = new SubscriptionServer({
    subscriptionManager
  }, subscriptionServerConfig);
};

const addGraphQLSubscriptions = httpServer => {
  if (module.hot && module.hot.data) {
    const prevServer = module.hot.data.subscriptionServer;
    if (prevServer && prevServer.wsServer) {
      log.debug('Reloading the subscription server.');
      prevServer.wsServer.close(() => {
        addSubscriptions(httpServer);
      });
    }
  } else {
    addSubscriptions(httpServer);
  }
};

if (module.hot) {
  module.hot.dispose(data => {
    try {
      data.subscriptionServer = subscriptionServer;
    } catch (error) {
      log(error.stack);
    }
  });
}

export { addGraphQLSubscriptions, pubsub };
