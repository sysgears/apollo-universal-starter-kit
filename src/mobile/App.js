import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { getOperationAST } from 'graphql';
import { ApolloProvider } from 'react-apollo';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { reducer as formReducer } from 'redux-form';
import { createApolloFetch } from 'apollo-fetch';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { ApolloLink } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { LoggingLink } from 'apollo-logger';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { CookiesProvider } from 'react-cookie';
import ApolloClient from 'apollo-client';
import url from 'url';

import modules from '../client/modules';
import MainScreenNavigator from '../client/app/Routes';
import settings from '../../settings';

const store = createStore(
  combineReducers({
    form: formReducer,

    ...modules.reducers
  }),
  {} // initial state
);

const { protocol, hostname, pathname, port } = url.parse(__BACKEND_URL__);

const getApiUri = expUri =>
  expUri && hostname === 'localhost'
    ? `${protocol}//${url.parse(expUri).hostname}:${port}${pathname}`
    : __BACKEND_URL__;

const createApolloClientAsync = async expUri => {
  const uri = getApiUri(expUri);
  const wsUri = uri.replace(/^http/, 'ws');
  const fetch = createApolloFetch({ uri });
  const cache = new InMemoryCache();

  for (const middleware of modules.middlewares) {
    fetch.batchUse(({ requests, options }, next) => {
      options.credentials = 'same-origin';
      options.headers = options.headers || {};
      const reqs = [...requests];
      const innerNext = () => {
        if (reqs.length > 0) {
          const req = reqs.shift();
          if (req) {
            middleware(req, options, innerNext);
          }
        } else {
          next();
        }
      };
      innerNext();
    });
  }

  for (const afterware of modules.afterwares) {
    fetch.batchUseAfter(({ response, options }, next) => {
      afterware(response, options, next);
    });
  }

  let connectionParams = {};
  for (const connectionParam of modules.connectionParams) {
    Object.assign(connectionParams, await connectionParam());
  }

  const wsClient = new SubscriptionClient(wsUri, {
    reconnect: true,
    connectionParams: connectionParams
  });

  let link = ApolloLink.split(
    operation => {
      const operationAST = getOperationAST(operation.query, operation.operationName);
      return !!operationAST && operationAST.operation === 'subscription';
    },
    new WebSocketLink(wsClient),
    new BatchHttpLink({ fetch })
  );

  return new ApolloClient({
    link: ApolloLink.from((settings.app.logging.apolloLogging ? [new LoggingLink()] : []).concat([link])),
    cache
  });
};

export default class Main extends Component {
  static propTypes = {
    expUri: PropTypes.string
  };

  componentDidMount() {
    createApolloClientAsync(this.props.expUri).then(client => this.setState({ client }));
  }

  render() {
    if (this.state && this.state.client) {
      return (
        <CookiesProvider>
          <Provider store={store}>
            <ApolloProvider client={this.state.client}>
              <MainScreenNavigator />
            </ApolloProvider>
          </Provider>
        </CookiesProvider>
      );
    } else {
      return <View />;
    }
  }
}
