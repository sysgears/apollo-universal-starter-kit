import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { constructDefaultOptions, createApolloFetch } from 'apollo-fetch';
import { ApolloLink } from 'apollo-link';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { withClientState } from 'apollo-link-state';
import { WebSocketLink } from 'apollo-link-ws';
import { LoggingLink } from 'apollo-logger';
import { getOperationAST, OperationDefinitionNode } from 'graphql';
import { History } from 'history';
import createHistory from 'history/createBrowserHistory';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import ReactGA from 'react-ga';
import { Provider, Store } from 'react-redux';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import { OperationOptions, SubscriptionClient } from 'subscriptions-transport-ws';

import settings from '../../../../settings';
import createApolloClient from '../../../common/createApolloClient';
import createReduxStore, { storeReducer } from '../../../common/createReduxStore';
import log from '../../../common/log';
// See the index.web.ts file to get more details on this
import modules from '../modules/index.web';
import { apiUrl } from '../net';
import RedBox from './RedBox';
import Routes from './Routes';

log.info(`Connecting to GraphQL backend at: ${apiUrl}`);

const cache: InMemoryCache = new InMemoryCache();

const connectionParams: any = {};
for (const connectionParam of modules.connectionParams) {
  Object.assign(connectionParams, connectionParam());
}

const wsUri: string = apiUrl.replace(/^http/, 'ws');

const wsClient: SubscriptionClient = new SubscriptionClient(wsUri, {
  reconnect: true,
  connectionParams
});

wsClient.use([
  {
    applyMiddleware(operationOptions: OperationOptions, next: any) {
      const params: any = {};
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

const fetchParams: BatchHttpLink.Options = {
  fetch:
    modules.createFetch(apiUrl) ||
    createApolloFetch({
      uri: apiUrl,
      constructOptions: (reqs, options) => ({
        ...constructDefaultOptions(reqs, options),
        credentials: 'include'
      })
    })
};

const netLink: ApolloLink = ApolloLink.split(
  operation => {
    const operationAST: OperationDefinitionNode = getOperationAST(operation.query, operation.operationName);
    return !!operationAST && operationAST.operation === 'subscription';
  },
  new WebSocketLink(wsClient),
  new BatchHttpLink(fetchParams) as any // A workaround for [at-loader] ERROR that casts type BatchHttpLink to ApolloLink
);

const linkState: ApolloLink = withClientState({ ...modules.resolvers, cache });

const links: ApolloLink[] = [...modules.link, linkState, netLink];

if (settings.app.logging.apolloLogging) {
  links.unshift(new LoggingLink());
}

const client: ApolloClient<InMemoryCache> = createApolloClient({
  link: ApolloLink.from(links),
  cache
});

if (window.__APOLLO_STATE__) {
  cache.restore(window.__APOLLO_STATE__);
}

const history: History = createHistory();

const logPageView = (location: any) => {
  ReactGA.set({ page: location.pathname });
  ReactGA.pageview(location.pathname);
};

// Initialize Google Analytics and send events on each location change
ReactGA.initialize(settings.analytics.ga.trackingId);
logPageView(window.location);

history.listen(location => logPageView(location));

let store: Store<any>;
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
    const serverError = window.__SERVER_ERROR__;
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
            {modules.getDataRoot(<ConnectedRouter history={history}>{Routes}</ConnectedRouter>)}
          </ApolloProvider>
        </Provider>
      )
    );
  }
}
