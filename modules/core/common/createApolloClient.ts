import { getOperationAST } from 'graphql';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { LoggingLink } from 'apollo-logger';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import ApolloClient from 'apollo-client';
import ApolloCacheRouter from 'apollo-cache-router';
import { hasDirectives } from 'apollo-utilities';
import { DocumentNode } from 'graphql';

import log from './log';
import settings from '../../../settings';

const createApolloClient = ({ apiUrl, createNetLink, links, connectionParams, clientResolvers }: any) => {
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

  const queryLink = createNetLink
    ? createNetLink(apiUrl)
    : new BatchHttpLink({
        uri: apiUrl,
        credentials: 'include'
      });

  let apiLink = queryLink;
  if (apiUrl && (__TEST__ || typeof navigator !== 'undefined')) {
    const finalConnectionParams = {};
    if (connectionParams) {
      for (const connectionParam of connectionParams) {
        Object.assign(finalConnectionParams, connectionParam());
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
      operation => {
        const operationAST = getOperationAST(operation.query, operation.operationName);
        return !!operationAST && operationAST.operation === 'subscription';
      },
      new WebSocketLink(wsClient),
      queryLink
    );
  }

  const linkState = withClientState({ ...clientResolvers, cache });

  const allLinks = [...(links || []), linkState, apiLink];

  if (settings.app.logging.apolloLogging && (!__TEST__ || typeof window !== 'undefined')) {
    allLinks.unshift(new LoggingLink({ logger: log.debug.bind(log) }));
  }

  const clientParams: any = {
    link: ApolloLink.from(allLinks),
    cache
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
