import fetch from 'isomorphic-unfetch';
import { getOperationAST } from 'graphql';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { LoggingLink } from 'apollo-logger';
import { SubscriptionClient, ConnectionParamsOptions } from 'subscriptions-transport-ws';
import ApolloClient from 'apollo-client';
import ApolloCacheRouter from 'apollo-cache-router';
import { getMainDefinition, hasDirectives } from 'apollo-utilities';
import { DocumentNode } from 'graphql';
import { IResolvers } from 'graphql-tools';

import settings from '@gqlapp/config';

import log from './log';

interface CreateApolloClientOptions {
  apiUrl?: string;
  createLink?: Array<(getApolloClient: () => ApolloClient<any>) => ApolloLink>;
  createNetLink?: (apiUrl: string, getApolloClient: () => ApolloClient<any>) => ApolloLink;
  connectionParams?: ConnectionParamsOptions[];
  clientResolvers?: { defaults: { [key: string]: any }; resolvers: IResolvers };
}

const createApolloClient = ({
  apiUrl,
  createNetLink,
  createLink,
  connectionParams,
  clientResolvers
}: CreateApolloClientOptions): ApolloClient<any> => {
  const netCache = new InMemoryCache();
  const localCache = new InMemoryCache();
  const cache = ApolloCacheRouter.override(
    ApolloCacheRouter.route(
      [netCache, localCache],
      (document: DocumentNode): InMemoryCache => {
        const operationName = (getOperationAST as any)(document).name;
        if (hasDirectives(['client'], document) || (operationName && operationName.value === 'GeneratedClientQuery')) {
          // Pass all @client queries and @client defaults to localCache
          return localCache;
        } else {
          // Pass all the other queries to netCache
          return netCache;
        }
      }
    ),
    {
      reset: () => {
        // On apolloClient.resetStore() reset only netCache and keep localCache intact
        return netCache.reset();
      }
    }
  );

  const getApolloClient = (): ApolloClient<any> => client;

  const queryLink = createNetLink
    ? createNetLink(apiUrl, getApolloClient)
    : new BatchHttpLink({
        uri: apiUrl,
        credentials: 'include',
        fetch
      });

  let apiLink = queryLink;
  if (apiUrl && (__TEST__ || typeof navigator !== 'undefined')) {
    const finalConnectionParams = {};
    if (connectionParams) {
      for (const connectionParam of connectionParams) {
        Object.assign(finalConnectionParams, (connectionParam as any)());
      }
    }

    const wsUri = apiUrl.replace(/^http/, 'ws');

    const globalVar = typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : {};
    const webSocketImpl = (globalVar as any).WebSocket || (globalVar as any).MozWebSocket;

    const wsClient = new SubscriptionClient(
      wsUri,
      {
        reconnect: true,
        connectionParams: finalConnectionParams
      },
      webSocketImpl
    );

    wsClient.use([
      {
        applyMiddleware(operationOptions, next) {
          Object.assign(operationOptions, finalConnectionParams);
          next();
        }
      }
    ]);

    wsClient.onDisconnected(() => {
      // console.log('onDisconnected');
    });

    wsClient.onReconnected(() => {
      // console.log('onReconnected');
    });

    apiLink = ApolloLink.split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
      },
      new WebSocketLink(wsClient),
      queryLink
    );
  }

  const linkState = withClientState({ ...clientResolvers, cache });

  const allLinks = [
    ...(createLink ? createLink.map((create: any) => create(getApolloClient)) : []),
    linkState,
    apiLink
  ];

  if (settings.app.logging.apolloLogging && (!__TEST__ || typeof window !== 'undefined')) {
    allLinks.unshift(new LoggingLink({ logger: log.debug.bind(log) }));
  }

  const clientParams: any = {
    link: ApolloLink.from(allLinks),
    cache,
    resolvers: (clientResolvers || ({} as any)).resolvers
  };
  if (__SSR__ && !__TEST__) {
    if (typeof window !== 'undefined' && window.__APOLLO_STATE__) {
      clientParams.initialState = window.__APOLLO_STATE__;
    } else {
      clientParams.ssrMode = true;
      clientParams.ssrForceFetchDelay = 100;
    }
  }

  if (__TEST__) {
    clientParams.defaultOptions = {
      query: {
        fetchPolicy: 'no-cache'
      }
    };
  }

  const client = new ApolloClient(clientParams);
  if (cache.constructor.name !== 'OverrideCache') {
    // Restore Apollo Link State defaults only if we don't use `apollo-cache-router`
    client.onResetStore((linkState as any).writeDefaults);
  }

  if (typeof window !== 'undefined' && window.__APOLLO_STATE__) {
    cache.restore(window.__APOLLO_STATE__);
  }

  return client;
};

export default createApolloClient;
