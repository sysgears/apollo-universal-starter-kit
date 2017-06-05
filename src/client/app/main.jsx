import React from 'react';
import { createBatchingNetworkInterface } from 'apollo-client';
import { addApolloLogging } from 'apollo-logger';
import { ApolloProvider } from 'react-apollo';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import { addPersistedQueries } from 'persistgraphql';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies, import/extensions
import queryMap from 'persisted_queries.json';
import ReactGA from 'react-ga';

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
  uri: __BACKEND_URL__ || "/graphql",
});

if (__CLIENT__) {
  const wsClient = new SubscriptionClient((__BACKEND_URL__ || (window.location.origin + '/graphql'))
    .replace(/^http/, 'ws')
    .replace(':' + settings.webpackDevPort, ':' + settings.apiPort));

  networkInterface = addGraphQLSubscriptions(
    networkInterface,
    wsClient,
  );
}

if (__PERSIST_GQL__) {
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

// Initialize Google Analytics and send events on each location change 
ReactGA.initialize('UA-000000-01'); // Replace your Google tracking code here

history.listen((location) => {
  ReactGA.set({ page: location.pathname });
  ReactGA.pageview(location.pathname);
});

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
