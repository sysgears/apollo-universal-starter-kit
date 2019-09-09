import { SubscriptionServer, ConnectionContext } from 'subscriptions-transport-ws';
import { execute, subscribe, GraphQLSchema } from 'graphql';
import { Server } from 'http';
import ServerModule from '@gqlapp/module-server-ts';
import { log } from '@gqlapp/core-common';

let subscriptionServer: SubscriptionServer;

const addSubscriptions = (httpServer: Server, schema: GraphQLSchema, modules: ServerModule) => {
  subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect: async (connectionParams: any, webSocket: any, ctx: ConnectionContext) => {
        try {
          return {
            ...(await modules.createContext(null, null, connectionParams, webSocket)),
            wsCtx: ctx
          };
        } catch (e) {
          log.error(e);
        }
      },
      onOperation: async (message: any, params: any, webSocket: any) => {
        try {
          params.context = await modules.createContext(null, null, message.payload, webSocket);
          return params;
        } catch (e) {
          log.error(e);
        }
      }
    },
    {
      server: httpServer,
      path: '/graphql'
    }
  );
};

const addGraphQLSubscriptions = (
  httpServer: Server,
  schema: GraphQLSchema,
  modules: ServerModule,
  entryModule?: NodeModule
) => {
  if (entryModule && entryModule.hot && entryModule.hot.data) {
    const prevServer = entryModule.hot.data.subscriptionServer;
    if (prevServer && prevServer.wsServer) {
      log.debug('Reloading the subscription server.');
      prevServer.wsServer.close(() => {
        addSubscriptions(httpServer, schema, modules);
      });
    }
  } else {
    addSubscriptions(httpServer, schema, modules);
  }
};

export const onAppDispose = (_: ServerModule, data: any) => {
  data.subscriptionServer = subscriptionServer;
};

export default addGraphQLSubscriptions;
