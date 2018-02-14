import React from 'react';
import PropTypes from 'prop-types';
import { getOperationAST } from 'graphql';
import { ApolloProvider } from 'react-apollo';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { createApolloFetch } from 'apollo-fetch';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
import { WebSocketLink } from 'apollo-link-ws';
import { LoggingLink } from 'apollo-logger';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import url from 'url';
import log from '../../common/log';

import modules from '../../client/src/modules';
import MainScreenNavigator from '../../client/src/app/Routes';
import settings from '../../../settings';

const store = createStore(
  combineReducers({
    ...modules.reducers
  }),
  {} // initial state
);

const { protocol, pathname, port } = url.parse(__BACKEND_URL__);

export default class Main extends React.Component {
  static propTypes = {
    expUri: PropTypes.string
  };

  render() {
    const { hostname } = url.parse(__BACKEND_URL__);
    const uri =
      this.props.expUri && hostname === 'localhost'
        ? `${protocol}//${url.parse(this.props.expUri).hostname}:${port}${pathname}`
        : __BACKEND_URL__;
    log.info(`Connecting to GraphQL backend at: ${uri}`);
    const fetch = createApolloFetch({ uri });
    const cache = new InMemoryCache();

    const wsUri = uri.replace(/^http/, 'ws');
    let link = ApolloLink.split(
      operation => {
        const operationAST = getOperationAST(operation.query, operation.operationName);
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

    const linkState = withClientState({ ...modules.resolvers, cache });

    const client = new ApolloClient({
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
