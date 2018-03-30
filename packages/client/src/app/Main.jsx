import React from 'react';
import { getOperationAST } from 'graphql';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { ApolloLink } from 'apollo-link';
import { createApolloFetch, constructDefaultOptions } from 'apollo-fetch';
import { withClientState } from 'apollo-link-state';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { LoggingLink } from 'apollo-logger';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import ReactGA from 'react-ga';

import RedBox from './RedBox';
import createApolloClient from '../../../common/createApolloClient';
import createReduxStore, { storeReducer } from '../../../common/createReduxStore';
import settings from '../../../../settings';
import Routes from './Routes';
import modules from '../modules';
import log from '../../../common/log';
import { apiUrl } from '../net';

log.info(`Connecting to GraphQL backend at: ${apiUrl}`);

const cache = new InMemoryCache();

let connectionParams = {};
for (const connectionParam of modules.connectionParams) {
  Object.assign(connectionParams, connectionParam());
}

const wsUri = apiUrl.replace(/^http/, 'ws');

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

const netLink = ApolloLink.split(
  operation => {
    const operationAST = getOperationAST(operation.query, operation.operationName);
    return !!operationAST && operationAST.operation === 'subscription';
  },
  new WebSocketLink(wsClient),
  new BatchHttpLink({
    fetch:
      modules.createFetch(apiUrl) ||
      createApolloFetch({
        uri: apiUrl,
        constructOptions: (reqs, options) => ({
          ...constructDefaultOptions(reqs, options),
          credentials: 'include'
        })
      })
  })
);

const linkState = withClientState({ ...modules.resolvers, cache });

const links = [...modules.link, linkState, netLink];

if (settings.app.logging.apolloLogging) {
  links.unshift(new LoggingLink());
}

const client = createApolloClient({
  link: ApolloLink.from(links),
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
  store = module.hot.data.store;
  store.replaceReducer(storeReducer);
} else {
  store = createReduxStore({}, client, routerMiddleware(history));
}

if (module.hot) {
  module.hot.dispose(data => {
    data.store = store;
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
      this.state = { error: new ServerError(serverError), ready: true };
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
            {modules.getDataRoot(<ConnectedRouter history={history}>{Routes}</ConnectedRouter>)}
          </ApolloProvider>
        </Provider>
      )
    );
  }
}
