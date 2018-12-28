import React from 'react';
import { hydrate, render } from 'react-dom';
import { ApolloClient } from 'apollo-client';
import { Store } from 'redux';
import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';
import ReactGA from 'react-ga';
import { apiUrl } from '@module/core-common';
import ClientModule from '@module/module-client-react';

import { Main } from './components';
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

let frontendReloadCount = 0;

export const onAppCreate = (modules: ClientModule, entryModule: NodeModule) => {
  initRef(modules, entryModule);
  acceptMHR(modules, entryModule);
  renderApp({ key: frontendReloadCount });
};

const initRef = (modules: ClientModule, entryModule: NodeModule) => {
  ref.modules = modules;
  ref.client = createApolloClient({
    apiUrl,
    createNetLink: ref.modules.createNetLink,
    links: ref.modules.link,
    connectionParams: ref.modules.connectionParams,
    clientResolvers: ref.modules.resolvers
  });
  if (entryModule.hot && entryModule.hot.data && entryModule.hot.data.store) {
    ref.store = entryModule.hot.data.store;
    ref.store.replaceReducer(getStoreReducer(ref.modules.reducers));
  } else {
    ref.store = createReduxStore(ref.modules.reducers, {}, ref.client, routerMiddleware(history));
  }
};

const acceptMHR = (modules: ClientModule, entryModule: NodeModule) => {
  if (entryModule.hot) {
    entryModule.hot.dispose(data => onAppDispose(modules, data));
    if (__CLIENT__) {
      entryModule.hot.accept();
    }
  }
  if (entryModule.hot && entryModule.hot.data) {
    log.debug('Updating front-end');
    frontendReloadCount = (frontendReloadCount || 0) + 1;
  }
};

const onAppDispose = (_: any, data: any) => {
  data.store = ref.store;
  delete window.__APOLLO_STATE__;
};

const renderApp = ({ key }: { key: number }) => {
  const renderFunc = __SSR__ ? hydrate : render;
  const root = document.getElementById('root');

  return renderFunc(<Main data={ref} history={history} rootTag={root} key={key} />, root);
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
