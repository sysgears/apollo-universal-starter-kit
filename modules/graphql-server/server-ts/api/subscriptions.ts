import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import { GraphQLSchema } from 'graphql';
import { Server } from 'http';
import ServerModule from '@gqlapp/module-server-ts';
import { log } from '@gqlapp/core-common';

interface SubsServerConfigShape {
  httpServer: Server;
  schema: GraphQLSchema;
  modules: ServerModule;
}

type CreateSubscriptionServer = ({ httpServer, schema, modules }: SubsServerConfigShape) => SubscriptionServer;

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

type ReloadSubscriptionServer = (prevServer: any, subscriptionConfig: SubsServerConfigShape) => void;

const reloadSubscriptionServer: ReloadSubscriptionServer = (prevServer, subscriptionConfig) => {
  log.debug('Reloading the subscription server.');
  prevServer.wsServer.close(() => addSubscriptions(subscriptionConfig));
};

type AddGraphQLSubs = (
  httpServer: Server,
  schema: GraphQLSchema,
  modules: ServerModule,
  entryModule?: NodeModule
) => any;

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
