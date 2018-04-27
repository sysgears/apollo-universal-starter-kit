import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
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

const client = createApolloClient({
  apiUrl,
  createNetLink: modules.createNetLink,
  links: modules.link,
  connectionParams: modules.connectionParams,
  clientResolvers: modules.resolvers
});

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

class Main extends React.Component {
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

export default Main;
