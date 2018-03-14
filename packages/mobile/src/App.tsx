import React from 'react';
import { getOperationAST, OperationDefinitionNode } from 'graphql';
import { ApolloProvider } from 'react-apollo';
import { createStore, combineReducers, StoreCreator } from 'redux';
import { Provider } from 'react-redux';
import { createApolloFetch, ApolloFetch } from 'apollo-fetch';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { ApolloLink, Operation } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
import { WebSocketLink } from 'apollo-link-ws';
import { LoggingLink } from 'apollo-logger';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient, { ApolloClientOptions } from 'apollo-client';
import url from 'url';
import log from '../../common/log';

import modules from '../../client/src/modules/index.native';
import MainScreenNavigator from '../../client/src/app/Routes';
import settings from '../../../settings';

const store: StoreCreator | any = createStore(
  combineReducers({
    ...modules.reducers
  }),
  {} // initial state
);

const { protocol, pathname, port } = url.parse(__BACKEND_URL__);

interface MainProps {
  expUri: string;
}

export default class Main extends React.Component<MainProps, any> {
  public render() {
    const { hostname } = url.parse(__BACKEND_URL__);
    const uri: string =
      this.props.expUri && hostname === 'localhost'
        ? `${protocol}//${url.parse(this.props.expUri).hostname}:${port}${pathname}`
        : __BACKEND_URL__;
    log.info(`Connecting to GraphQL backend at: ${uri}`);
    const fetch: ApolloFetch = createApolloFetch({ uri });
    const cache: InMemoryCache = new InMemoryCache();

    const wsUri: string = uri.replace(/^http/, 'ws');
    const link: ApolloLink = ApolloLink.split(
      (operation: Operation) => {
        const operationAST: OperationDefinitionNode = getOperationAST(operation.query, operation.operationName);
        return !!operationAST && operationAST.operation === 'subscription';
      },
      new WebSocketLink({
        uri: wsUri,
        options: {
          reconnect: true
        }
      }),
      new BatchHttpLink({ fetch })
    );

    const linkState: any = withClientState({ ...modules.resolvers, cache });

    const client: ApolloClient<any> = new ApolloClient({
      link: ApolloLink.from((settings.app.logging.apolloLogging ? [new LoggingLink()] : []).concat([linkState, link])),
      cache
    });

    return (
      <Provider store={store}>
        <ApolloProvider client={client}>
          <MainScreenNavigator />
        </ApolloProvider>
      </Provider>
    );
  }
}
