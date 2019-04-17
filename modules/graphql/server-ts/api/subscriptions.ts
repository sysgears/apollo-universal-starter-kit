import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import ServerModule from '@gqlapp/module-server-ts';
import { log } from '@gqlapp/core-common';

import { CreateSubscriptionServer, SubsServerConfigShape, ReloadSubscriptionServer, AddGraphQLSubs } from '..';

let subscriptionServer: SubscriptionServer;

const createSubscriptionServer: CreateSubscriptionServer = ({ httpServer, schema, modules }) => {
  const subscriptionConfig = {
    schema,
    execute,
    subscribe,
    onConnect: (connectionParams: any, webSocket: any) =>
      modules.createContext(null, null, connectionParams, webSocket),
    onOperation: async (message: any, params: any, webSocket: any) => {
      params.context = await modules.createContext(null, null, message.payload, webSocket);
      return params;
    }
  };

  const serverConfig = {
    server: httpServer,
    path: '/graphql'
  };

  return SubscriptionServer.create(subscriptionConfig, serverConfig);
};

const addSubscriptions = (config: SubsServerConfigShape) => {
  subscriptionServer = createSubscriptionServer(config);
};

const reloadSubscriptionServer: ReloadSubscriptionServer = (prevServer, subscriptionConfig) => {
  log.debug('Reloading the subscription server.');
  prevServer.wsServer.close(() => addSubscriptions(subscriptionConfig));
};

const addGraphQLSubscriptions: AddGraphQLSubs = (httpServer, schema, modules, entryModule) => {
  const subscriptionConfig: SubsServerConfigShape = { httpServer, schema, modules };
  if (entryModule && entryModule.hot && entryModule.hot.data) {
    const prevServer = entryModule.hot.data.subscriptionServer;
    return prevServer && prevServer.wsServer && reloadSubscriptionServer(prevServer, subscriptionConfig);
  }

  return addSubscriptions(subscriptionConfig);
};

export const onAppDispose = (_: ServerModule, data: any) => {
  data.subscriptionServer = subscriptionServer;
};

export default addGraphQLSubscriptions;
