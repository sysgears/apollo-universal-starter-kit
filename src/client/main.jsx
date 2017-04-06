import React from 'react';
import { createBatchingNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import { addPersistedQueries } from 'persistgraphql';

import createApolloClient from '../apollo_client';
import createReduxStore from '../redux_store';
import routes from '../routes';
import { app as settings } from '../../package.json';

import '../ui/styles/styles.scss';

// Virtual module, see webpack-virtual-modules usage in webpack.run.js
export { default as backendReloadCount } from 'backend_reload'; // eslint-disable-line import/no-unresolved

// Favicon.ico should not be hashed, since some browsers expect it to be exactly on /favicon.ico URL
require('!file-loader?name=[name].[ext]!../assets/favicon.ico'); // eslint-disable-line import/no-webpack-loader-syntax

// Require all files from assets dir recursively addding them into assets.json
let req = require.context('!file-loader?name=[hash].[ext]!../assets', true, /.*/);
req.keys().map(req);

let networkInterface = createBatchingNetworkInterface({
  opts: {
    credentials: "same-origin",
  },
  batchInterval: 20,
  uri: "/graphql",
});

if (__CLIENT__) {
  const subscriptions = require('subscriptions-transport-ws');

  const wsClient = new subscriptions.SubscriptionClient(window.location.origin.replace(/^http/, 'ws')
    .replace(':' + settings.webpackDevPort, ':' + settings.apiPort));

  networkInterface = subscriptions.addGraphQLSubscriptions(
    networkInterface,
    wsClient,
  );
}

if (settings.persistGraphQL) {
  // eslint-disable-next-line import/no-extraneous-dependencies, import/no-unresolved
  const queryMap = require('persisted_queries.json');
  networkInterface = addPersistedQueries(networkInterface, queryMap);
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