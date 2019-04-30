import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { ConnectedRouter, routerMiddleware } from 'connected-react-router';
import ReactGA from 'react-ga';

import { apiUrl, createApolloClient, createReduxStore, getStoreReducer, log } from '@gqlapp/core-common';
import ClientModule from '@gqlapp/module-client-react';
import settings from '@gqlapp/config';

import RedBox from './RedBox';

log.info(`Connecting to GraphQL backend at: ${apiUrl}`);

const ref: { modules: ClientModule; client: ApolloClient<any>; store: Store } = {
  modules: null,
  client: null,
  store: null
};

const history = createBrowserHistory();

export const onAppCreate = (modules: ClientModule, entryModule: NodeModule) => {
  ref.modules = modules;
  ref.client = createApolloClient({
    apiUrl,
    createNetLink: ref.modules.createNetLink,
    createLink: ref.modules.createLink,
    connectionParams: ref.modules.connectionParams,
    clientResolvers: ref.modules.resolvers
  });
  if (entryModule.hot && entryModule.hot.data && entryModule.hot.data.store) {
    ref.store = entryModule.hot.data.store;
    ref.store.replaceReducer(getStoreReducer(history, ref.modules.reducers));
  } else {
    ref.store = createReduxStore(ref.modules.reducers, {}, history, routerMiddleware(history));
  }
};

const logPageView = (location: any) => {
  ReactGA.set({ page: location.pathname });
  ReactGA.pageview(location.pathname);
};

// Initialize Google Analytics and send events on each location change
ReactGA.initialize(settings.analytics.ga.trackingId);
logPageView(window.location);

history.listen(location => logPageView(location));

export const onAppDispose = (_: any, data: any) => {
  data.store = ref.store;
  delete window.__APOLLO_STATE__;
};

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
  ready?: boolean;
}

export class Main extends React.Component<any, MainState> {
  constructor(props: any) {
    super(props);
    const serverError = window.__SERVER_ERROR__;
    serverError ? (this.state = { error: new ServerError(serverError), ready: true }) : (this.state = {});
  }

  public componentDidCatch(error: ServerError, info: any) {
    this.setState({ error, info });
  }

  public render() {
    return this.state.error ? (
      <RedBox error={this.state.error} />
    ) : (
      ref.modules.getWrappedRoot(
        <Provider store={ref.store}>
          <ApolloProvider client={ref.client}>
            {ref.modules.getDataRoot(<ConnectedRouter history={history}>{ref.modules.router}</ConnectedRouter>)}
          </ApolloProvider>
        </Provider>
      )
    );
  }
}
