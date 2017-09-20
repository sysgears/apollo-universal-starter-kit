import React from 'react';
// import { addApolloLogging } from 'apollo-logger';
import { getOperationAST } from 'graphql';
import { createApolloFetch } from 'apollo-fetch';
import HttpLink from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import WebSocketLink from 'apollo-link-ws';
import InMemoryCache from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
// import { addPersistedQueries } from 'persistgraphql';
// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies, import/extensions
// import queryMap from 'persisted_queries.json';
import ReactGA from 'react-ga';
import { CookiesProvider } from 'react-cookie';

import createApolloClient from '../../common/createApolloClient';
import createReduxStore from '../../common/createReduxStore';
// import settings from '../../../settings';
import Routes from './Routes';
import modules from '../modules';

import '../styles/styles.scss';

const fetch = createApolloFetch({ uri: __BACKEND_URL__ || '/graphql' });
const cache = new InMemoryCache();

let link;
if (__CLIENT__) {
  // networkInterface.use([
  //   {
  //     applyBatchMiddleware(req, next) {
  //       if (!req.options.headers) {
  //         req.options.headers = {};
  //       }
  //
  //       for (const middleware of modules.middlewares) {
  //         middleware(req);
  //       }
  //
  //       next();
  //     }
  //   }
  // ]);
  //
  // networkInterface.useAfter([
  //   {
  //     applyBatchAfterware(res, next) {
  //       for (const afterware of modules.afterwares) {
  //         afterware(res);
  //       }
  //
  //       next();
  //     }
  //   }
  // ]);

  let connectionParams = {};
  for (const connectionParam of modules.connectionParams) {
    Object.assign(connectionParams, connectionParam());
  }

  const wsUri = (__BACKEND_URL__ || window.location.origin + '/graphql').replace(/^http/, 'ws');
  link = ApolloLink.split(
    operation => {
      const operationAST = getOperationAST(operation.query, operation.operationName);
      return !!operationAST && operationAST.operation === 'subscription';
    },
    new WebSocketLink({
      uri: wsUri,
      options: {
        reconnect: true,
        connectionParams: connectionParams
      }
    }),
    new HttpLink({ fetch })
  );
} else {
  link = new HttpLink({ fetch });
}

// if (__PERSIST_GQL__) {
//   networkInterface = addPersistedQueries(networkInterface, queryMap);
// }

// if (settings.apolloLogging) {
//   networkInterface = addApolloLogging(networkInterface);
// }

const client = createApolloClient({
  link,
  cache
});

if (window.__APOLLO_STATE__) {
  cache.restore(window.__APOLLO_STATE__);
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

const store = createReduxStore({}, client, routerMiddleware(history));

if (module.hot) {
  module.hot.dispose(() => {
    // Force Apollo to fetch the latest data from the server
    delete window.__APOLLO_STATE__;
  });
}

const Main = () => (
  <CookiesProvider>
    <ApolloProvider store={store} client={client}>
      <ConnectedRouter history={history}>{Routes}</ConnectedRouter>
    </ApolloProvider>
  </CookiesProvider>
);

export default Main;
