import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import ReactGA from 'react-ga';
import { apiUrl } from '@module/core-common';
import ClientModule from '@module/module-client-react';

import RedBox from './RedBox';
import createApolloClient from '../../../packages/common/createApolloClient';
import createReduxStore, { getStoreReducer } from '../../../packages/common/createReduxStore';
import log from '../../../packages/common/log';
import settings from '../../../settings';

log.info(`Connecting to GraphQL backend at: ${apiUrl}`);

const ref: { modules: ClientModule; client: ApolloClient<any>; store: Store } = {
  modules: null,
  client: null,
  store: null
};

export const onAppCreate = (modules: ClientModule) => {
  ref.modules = modules;
  ref.client = createApolloClient({
    apiUrl,
    createNetLink: ref.modules.createNetLink,
    links: ref.modules.link,
    connectionParams: ref.modules.connectionParams,
    clientResolvers: ref.modules.resolvers
  });
  ref.store = createReduxStore(ref.modules.reducers, {}, ref.client, routerMiddleware(history));
};

const history = createHistory();
const logPageView = (location: any) => {
  ReactGA.set({ page: location.pathname });
  ReactGA.pageview(location.pathname);
};

// Initialize Google Analytics and send events on each location change
ReactGA.initialize(settings.analytics.ga.trackingId);
logPageView(window.location);

history.listen(location => logPageView(location));

if (module.hot && module.hot.data && module.hot.data.store) {
  ref.store = module.hot.data.store;
  ref.store.replaceReducer(getStoreReducer(ref.modules.reducers));
}

if (module.hot) {
  module.hot.dispose(data => {
    data.store = ref.store;
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
