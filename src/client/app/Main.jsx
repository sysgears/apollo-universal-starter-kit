import React from 'react';
import { getOperationAST } from 'graphql';
import { createApolloFetch } from 'apollo-fetch';
import BatchHttpLink from 'apollo-link-batch-http';
import { ApolloLink } from 'apollo-link';
import WebSocketLink from 'apollo-link-ws';
import InMemoryCache from 'apollo-cache-inmemory';
import { LoggingLink } from 'apollo-logger';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
// import { addPersistedQueries } from 'persistgraphql';
// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies, import/extensions
// import queryMap from 'persisted_queries.json';
import ReactGA from 'react-ga';
import { CookiesProvider } from 'react-cookie';
import url from 'url';

import createApolloClient from '../../common/createApolloClient';
import createReduxStore, { storeReducer } from '../../common/createReduxStore';
import settings from '../../../settings';
import Routes from './Routes';
import modules from '../modules';

import '../styles/styles.scss';

const { hostname, pathname, port } = url.parse(__BACKEND_URL__);

const fetch = createApolloFetch({ uri: hostname === 'localhost' ? '/graphql' : __BACKEND_URL__ });
const cache = new InMemoryCache();

fetch.batchUse(({ requests, options }, next) => {
  try {
    options.credentials = 'include';
    options.headers = options.headers || {};
    for (const middleware of modules.middlewares) {
      for (const req of requests) {
        middleware(req, options);
      }
    }
  } catch (e) {
    console.error(e);
  }

  next();
});

fetch.batchUseAfter(({ response, options }, next) => {
  try {
    for (const afterware of modules.afterwares) {
      afterware(response, options);
    }
  } catch (e) {
    console.error(e);
  }
  next();
});

let connectionParams = {};
for (const connectionParam of modules.connectionParams) {
  Object.assign(connectionParams, connectionParam());
}

const wsUri = (hostname === 'localhost'
  ? `${window.location.protocol}${window.location.hostname}:${port}${pathname}`
  : __BACKEND_URL__
).replace(/^http/, 'ws');
let link = ApolloLink.split(
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
  new BatchHttpLink({ fetch })
);

// if (__PERSIST_GQL__) {
//   networkInterface = addPersistedQueries(networkInterface, queryMap);
// }

const client = createApolloClient({
  link: ApolloLink.from((settings.apolloLogging ? [new LoggingLink()] : []).concat([link])),
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
ReactGA.initialize(`${process.env.GOOGLE_TRACKING_ID}`); // Replace your Google tracking code here
logPageView(window.location);

history.listen(location => logPageView(location));

let store;
if (module.hot && module.hot.data && module.hot.data.store) {
  // console.log("Restoring Redux store:", JSON.stringify(module.hot.data.store.getState()));
  store = module.hot.data.store;
  store.replaceReducer(storeReducer);
} else {
  store = createReduxStore({}, client, routerMiddleware(history));
}

if (module.hot) {
  module.hot.dispose(data => {
    // console.log("Saving Redux store:", JSON.stringify(store.getState()));
    data.store = store;
    // Force Apollo to fetch the latest data from the server
    delete window.__APOLLO_STATE__;
  });
}

const Main = () => (
  <CookiesProvider>
    <Provider store={store}>
      <ApolloProvider client={client}>
        <ConnectedRouter history={history}>{Routes}</ConnectedRouter>
      </ApolloProvider>
    </Provider>
  </CookiesProvider>
);

export default Main;
