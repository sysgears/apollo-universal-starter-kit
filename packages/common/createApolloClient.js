import { getOperationAST } from 'graphql';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { ApolloLink } from 'apollo-link';
import { createApolloFetch, constructDefaultOptions } from 'apollo-fetch';
import { withClientState } from 'apollo-link-state';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { LoggingLink } from 'apollo-logger';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import ApolloClient from 'apollo-client';

import settings from '../../settings';

const createApolloClient = ({ apiUrl, createFetch, schemaLink, links, connectionParams, clientResolvers }) => {
  const cache = new InMemoryCache();

  const netLink = schemaLink
    ? schemaLink
    : new BatchHttpLink({
        fetch:
          (createFetch && createFetch(apiUrl)) ||
          createApolloFetch({
            uri: apiUrl,
            constructOptions: (reqs, options) => ({
              ...constructDefaultOptions(reqs, options),
              credentials: 'include'
            })
          })
      });

  let apiLink = netLink;
  if (typeof window !== 'undefined') {
    let finalConnectionParams = {};
    if (connectionParams) {
      for (const connectionParam of connectionParams) {
        Object.assign(finalConnectionParams, connectionParam());
      }
    }

    const wsUri = apiUrl.replace(/^http/, 'ws');

    const wsClient = new SubscriptionClient(wsUri, {
      reconnect: true,
      connectionParams: finalConnectionParams
    });

    wsClient.use([
      {
        applyMiddleware(operationOptions, next) {
          Object.assign(operationOptions, finalConnectionParams);
          next();
        }
      }
    ]);

    wsClient.onDisconnected(() => {
      //console.log('onDisconnected');
    });

    wsClient.onReconnected(() => {
      //console.log('onReconnected');
    });

    apiLink = ApolloLink.split(
      operation => {
        const operationAST = getOperationAST(operation.query, operation.operationName);
        return !!operationAST && operationAST.operation === 'subscription';
      },
      new WebSocketLink(wsClient),
      netLink
    );
  }

  const linkState = withClientState({ ...clientResolvers, cache });

  const allLinks = [...links, linkState, apiLink];

  if (settings.app.logging.apolloLogging) {
    allLinks.unshift(new LoggingLink());
  }

  const clientParams = {
    link: ApolloLink.from(allLinks),
    cache
  };
  if (__SSR__) {
    if (typeof window !== 'undefined' && window.__APOLLO_STATE__) {
      clientParams.initialState = window.__APOLLO_STATE__;
    } else {
      clientParams.ssrMode = true;
      clientParams.ssrForceFetchDelay = 100;
    }
  }

  const client = new ApolloClient(clientParams);
  client.onResetStore(linkState.writeDefaults);

  if (typeof window !== 'undefined' && window.__APOLLO_STATE__) {
    cache.restore(window.__APOLLO_STATE__);
  }

  return client;
};

export default createApolloClient;
