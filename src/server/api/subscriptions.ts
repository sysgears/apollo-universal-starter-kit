import { execute, subscribe } from 'graphql';
import { Server } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';

import log from '../../common/log';
import modules from '../../server/modules';
import schema from './schema';

let subscriptionServer: SubscriptionServer;

const addSubscriptions = (httpServer: Server) => {
  subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect: (connectionParams: any, webSocket: any) => modules.createContext(null, connectionParams, webSocket),
      onOperation: async (message: any, params: any, webSocket: any) => {
        params.context = await modules.createContext(null, message.payload, webSocket);
        return params;
      }
    },
    {
      server: httpServer,
      path: '/graphql'
    }
  );
};

const addGraphQLSubscriptions = (httpServer: Server) => {
  if (module.hot && module.hot.data) {
    const prevServer = (module.hot.data as any).subscriptionServer as any;
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
  module.hot.dispose((data: any) => {
    try {
      data.subscriptionServer = subscriptionServer;
    } catch (error) {
      log(error.stack);
    }
  });
}

export default addGraphQLSubscriptions;
