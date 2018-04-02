import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { constructDefaultOptions, createApolloFetch } from 'apollo-fetch';
import { ApolloLink } from 'apollo-link';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { withClientState } from 'apollo-link-state';
import { WebSocketLink } from 'apollo-link-ws';
import { LoggingLink } from 'apollo-logger';
import { getOperationAST, OperationDefinitionNode } from 'graphql';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { Provider, Store } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import url from 'url';
import log from '../../common/log';

import settings from '../../../settings';
import MainScreenNavigator from '../../client/src/app/Routes';
import modules from '../../client/src/modules';

const store: Store<any> = createStore(
  combineReducers({
    ...modules.reducers
  }),
  {} // initial state
);

const { protocol, pathname, port, hostname } = url.parse(__API_URL__);

const buildUrl = (exp: any): string =>
  exp.manifest.bundleUrl && hostname === 'localhost'
    ? `${protocol}//${url.parse(exp.manifest.bundleUrl).hostname}:${port}${pathname}`
    : __API_URL__;

interface MainProps {
  exp?: any;
}

export default class Main extends React.Component<MainProps, {}> {
  public render() {
    const uri: string = buildUrl(this.props.exp);
    log.info(`Connecting to GraphQL backend at: ${uri}`);
    const cache: InMemoryCache = new InMemoryCache();

    const wsUri: string = uri.replace(/^http/, 'ws');

    const fetchParams: BatchHttpLink.Options = {
      fetch:
        modules.createFetch(uri) ||
        createApolloFetch({
          uri,
          constructOptions: (reqs, options) => ({
            ...constructDefaultOptions(reqs, options),
            credentials: 'include'
          })
        })
    };

    const netLink: ApolloLink = ApolloLink.split(
      operation => {
        const operationAST: OperationDefinitionNode = getOperationAST(operation.query, operation.operationName);
        return !!operationAST && operationAST.operation === 'subscription';
      },
      new WebSocketLink({
        uri: wsUri,
        options: {
          reconnect: true
        }
      }),
      new BatchHttpLink(fetchParams) as any // A workaround for [at-loader] ERROR that casts type BatchHttpLink to ApolloLink
    );

    const connectionParams: any = {};
    for (const connectionParam of modules.connectionParams) {
      Object.assign(connectionParams, connectionParam());
    }

    const linkState: ApolloLink = withClientState({ ...modules.resolvers, cache });

    const links: ApolloLink[] = [...modules.link, linkState, netLink];

    if (settings.app.logging.apolloLogging) {
      links.unshift(new LoggingLink());
    }

    const client: ApolloClient<InMemoryCache> = new ApolloClient({
      link: ApolloLink.from(links),
      cache
    }) as any;

    return (
      <Provider store={store}>
        <ApolloProvider client={client}>
          <MainScreenNavigator />
        </ApolloProvider>
      </Provider>
    );
  }
}
