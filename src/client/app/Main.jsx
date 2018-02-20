import React from 'react';
import { getOperationAST } from 'graphql';
import { createApolloFetch } from 'apollo-fetch';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { ApolloLink } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { LoggingLink } from 'apollo-logger';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import { SubscriptionClient } from 'subscriptions-transport-ws';
// import { addPersistedQueries } from 'persistgraphql';
// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies, import/extensions
// import queryMap from 'persisted_queries.json';
import ReactGA from 'react-ga';
import url from 'url';

import RedBox from './RedBox';
import createApolloClient from '../../common/createApolloClient';
import createReduxStore, { storeReducer } from '../../common/createReduxStore';
import settings from '../../../settings';
import Routes from './Routes';
import modules from '../modules';

const { hostname, pathname, port } = url.parse(__BACKEND_URL__);

const fetch = createApolloFetch({
  uri: hostname === 'localhost' ? '/graphql' : __BACKEND_URL__,
  constructOptions: modules.constructFetchOptions
});
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
  Object.assign(connectionParams, connectionParam());
}

const wsUri = (hostname === 'localhost'
  ? `${window.location.protocol}//${window.location.hostname}:${__DEV__ ? port : window.location.port}${pathname}`
  : __BACKEND_URL__
).replace(/^http/, 'ws');

const wsClient = new SubscriptionClient(wsUri, {
  reconnect: true,
  connectionParams: connectionParams
});

wsClient.use([
  {
    applyMiddleware(operationOptions, next) {
      let params = {};
      for (const param of modules.connectionParams) {
        Object.assign(params, param());
      }

      Object.assign(operationOptions, params);
      next();
    }
  }
]);

wsClient.onDisconnected(() => {
  //console.log('onDisconnected');
});

wsClient.onReconnected(() => {
  //console.log('onReconnected');
});

let link = ApolloLink.split(
  operation => {
    const operationAST = getOperationAST(operation.query, operation.operationName);
    return !!operationAST && operationAST.operation === 'subscription';
  },
  new WebSocketLink(wsClient),
  new BatchHttpLink({ fetch })
);

// if (__PERSIST_GQL__) {
//   networkInterface = addPersistedQueries(networkInterface, queryMap);
// }

const client = createApolloClient({
  link: ApolloLink.from((settings.app.logging.apolloLogging ? [new LoggingLink()] : []).concat([link])),
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
ReactGA.initialize(settings.analytics.ga.trackingId);
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

class ServerError extends Error {
  constructor(error) {
    super();
    for (const key of Object.getOwnPropertyNames(error)) {
      this[key] = error[key];
    }
    this.name = 'ServerError';
  }
}

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    const serverError = window.__SERVER_ERROR__;
    if (serverError) {
      this.state = { error: new ServerError(serverError) };
    } else {
      this.state = {};
    }
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
  }

  render() {
    return this.state.error ? (
      <RedBox error={this.state.error} />
    ) : (
      modules.getWrappedRoot(
        <Provider store={store}>
          <ApolloProvider client={client}>
            <ConnectedRouter history={history}>{Routes}</ConnectedRouter>
          </ApolloProvider>
        </Provider>
      )
    );
  }
}
