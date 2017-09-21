import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';

import schema from './schema';
import log from '../../common/log';
import modules from '../../server/modules';

let subscriptionServer;

const addSubscriptions = httpServer => {
  subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect: (connectionParams, webSocket) => modules.createContext(null, connectionParams, webSocket)
    },
    {
      server: httpServer,
      path: '/graphql'
    }
  );
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

export default addGraphQLSubscriptions;
