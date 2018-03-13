import { InMemoryCache } from 'apollo-cache-inmemory';
import { createApolloFetch } from 'apollo-fetch';
import { ApolloLink } from 'apollo-link';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { withClientState } from 'apollo-link-state';
import { WebSocketLink } from 'apollo-link-ws';
import { LoggingLink } from 'apollo-logger';
import { getOperationAST } from 'graphql';
import { LocationDescriptorObject } from 'history';
import createHistory from 'history/createBrowserHistory';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
// import { addPersistedQueries } from 'persistgraphql';
// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies, import/extensions
// import queryMap from 'persisted_queries.json';
import ReactGA from 'react-ga';
import { Provider } from 'react-redux';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import url from 'url';

import settings from '../../../../settings';
import createApolloClient from '../../../common/createApolloClient';
import createReduxStore, { storeReducer } from '../../../common/createReduxStore';
import log from '../../../common/log';
import modules from '../modules/index.web';
import RedBox from './RedBox';
import Routes from './Routes';

const { hostname, pathname, port } = url.parse(__BACKEND_URL__);

const uri = hostname === 'localhost' && __SSR__ ? '/graphql' : __BACKEND_URL__;
const fetch = createApolloFetch({
  uri,
  constructOptions: modules.constructFetchOptions
});

log.info(`Connecting to GraphQL backend at: ${uri}`);

const cache = new InMemoryCache();

for (const middleware of modules.middlewares) {
  fetch.batchUse(({ requests, options }: any, next: any) => {
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
  fetch.batchUseAfter(({ response, options }: any, next: any) => {
    afterware(response, options, next);
  });
}

const connectionParams = {};
for (const connectionParam of modules.connectionParams) {
  Object.assign(connectionParams, connectionParam());
}

const wsUri = (hostname === 'localhost'
  ? `${window.location.protocol}${window.location.hostname}:${__DEV__ ? port : window.location.port}${pathname}`
  : __BACKEND_URL__
).replace(/^http/, 'ws');

const wsClient = new SubscriptionClient(wsUri, {
  reconnect: true,
  connectionParams
});

wsClient.use([
  {
    applyMiddleware(operationOptions, next) {
      const params = {};
      for (const param of modules.connectionParams) {
        Object.assign(params, param());
      }

      Object.assign(operationOptions, params);
      next();
    }
  }
]);

wsClient.onDisconnected(() => {
  // console.log('onDisconnected');
});

wsClient.onReconnected(() => {
  // console.log('onReconnected');
});

const link = ApolloLink.split(
  (operation: any) => {
    const operationAST = getOperationAST(operation.query, operation.operationName);
    return !!operationAST && operationAST.operation === 'subscription';
  },
  new WebSocketLink(wsClient),
  new BatchHttpLink({ fetch })
);

const linkState = withClientState({ ...modules.resolvers, cache });

// if (__PERSIST_GQL__) {
//   networkInterface = addPersistedQueries(networkInterface, queryMap);
// }

const client = createApolloClient({
  link: ApolloLink.from((settings.app.logging.apolloLogging ? [new LoggingLink()] : []).concat([linkState, link])),
  cache
});

if (window.__APOLLO_STATE__) {
  cache.restore(window.__APOLLO_STATE__);
}

const history = createHistory();

const logPageView = (location: LocationDescriptorObject) => {
  ReactGA.set({ page: location.pathname });
  ReactGA.pageview(location.pathname);
};

// Initialize Google Analytics and send events on each location change
ReactGA.initialize(settings.analytics.ga.trackingId);
logPageView(window.location);

history.listen((location: LocationDescriptorObject) => logPageView(location));

let store: any;
if (module.hot && module.hot.data && module.hot.data.store) {
  // console.log("Restoring Redux store:", JSON.stringify(module.hot.data.store.getState()));
  store = module.hot.data.store;
  store.replaceReducer(storeReducer);
} else {
  store = createReduxStore({}, client, routerMiddleware(history));
}

if (module.hot) {
  module.hot.dispose((data: any) => {
    // console.log("Saving Redux store:", JSON.stringify(store.getState()));
    data.store = store;
    // Force Apollo to fetch the latest data from the server
    delete window.__APOLLO_STATE__;
  });
}

class ServerError extends Error {
  constructor(error: any) {
    super();
    for (const key of Object.getOwnPropertyNames(error)) {
      this[key] = error[key];
    }
    this.name = 'ServerError';
  }
}

interface MainState {
  error?: ServerError;
  info?: any;
}

export default class Main extends React.Component<any, MainState> {
  constructor(props: any) {
    super(props);
    const serverError: any = window.__SERVER_ERROR__;
    this.state = serverError ? { error: new ServerError(serverError) } : {};
  }

  public componentDidCatch(error: ServerError, info: any) {
    this.setState({ error, info });
  }

  public render() {
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

export { ServerError };
