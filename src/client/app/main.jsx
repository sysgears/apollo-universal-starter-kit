import React from 'react';
import { createBatchingNetworkInterface } from 'apollo-client';
import { addApolloLogging } from 'apollo-logger';
import { ApolloProvider } from 'react-apollo';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import { addPersistedQueries } from 'persistgraphql';
import subscriptions from 'subscriptions-transport-ws';
// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies, import/extensions
import queryMap from 'persisted_queries.json';

import createApolloClient from '../../common/apollo_client';
import createReduxStore from '../../common/redux_store';
import routes from '../app/routes';
import { app as settings } from '../../../package.json';

import '../styles/styles.scss';

let networkInterface = createBatchingNetworkInterface({
  opts: {
    credentials: "same-origin",
  },
  batchInterval: 20,
  uri: "/graphql",
});

if (__CLIENT__) {
  const wsClient = new subscriptions.SubscriptionClient(window.location.origin.replace(/^http/, 'ws')
    .replace(':' + settings.webpackDevPort, ':' + settings.apiPort));

  networkInterface = subscriptions.addGraphQLSubscriptions(
    networkInterface,
    wsClient,
  );
}

if (settings.persistGraphQL) {
  networkInterface = addPersistedQueries(networkInterface, queryMap);
}

if (settings.apolloLogging) {
  networkInterface = addApolloLogging(networkInterface);
}

const client = createApolloClient(networkInterface);

let initialState = {};

if (window.__APOLLO_STATE__) {
  initialState = window.__APOLLO_STATE__;
}

const history = createHistory();

const store = createReduxStore(initialState, client, routerMiddleware(history));

if (module.hot) {
  module.hot.dispose(() => {
    // Force Apollo to fetch the latest data from the server
    delete window.__APOLLO_STATE__;
  });
}

const Main = () => (
  <ApolloProvider store={store} client={client}>
    <ConnectedRouter history={history}>
      {routes}
    </ConnectedRouter>
  </ApolloProvider>
);

export default Main;
