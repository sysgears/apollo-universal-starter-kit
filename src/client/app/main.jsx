import React from 'react';
import { createBatchingNetworkInterface } from 'apollo-client';
import { addApolloLogging } from 'apollo-logger';
import { ApolloProvider } from 'react-apollo';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import { Route } from 'react-router-dom';
import { addPersistedQueries } from 'persistgraphql';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies, import/extensions
import queryMap from 'persisted_queries.json';
import ReactGA from 'react-ga';

// Import Language Provider
import { LanguageProvider } from '../../client/modules/language/containers/language-provider';

import createApolloClient from '../../common/apollo_client';
import createReduxStore from '../../common/redux_store';
import settings from '../../../settings';
import App from '../app/app';

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
    .replace(/^http/, 'ws'), {
      reconnect: true
    });
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

const logPageView = location => {
  ReactGA.set({ page: location.pathname });
  ReactGA.pageview(location.pathname);
};

// Initialize Google Analytics and send events on each location change 
ReactGA.initialize('UA-000000-01'); // Replace your Google tracking code here
logPageView(window.location);

history.listen(location => logPageView(location));

const store = createReduxStore(initialState, client, routerMiddleware(history));

if (module.hot) {
  module.hot.dispose(() => {
    // Force Apollo to fetch the latest data from the server
    delete window.__APOLLO_STATE__;
  });
}

const Main = (messages) => (
  <ApolloProvider store={store} client={client}>
    <LanguageProvider messages={messages}>
      <ConnectedRouter history={history}>
        <Route path='/' component={App} />
      </ConnectedRouter>
    </LanguageProvider>
  </ApolloProvider>
);

export default Main;
