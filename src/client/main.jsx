import React from 'react'
import ApolloClient, { createNetworkInterface, addTypename } from 'apollo-client'
import { Client } from 'subscriptions-transport-ws';
import { ApolloProvider } from 'react-apollo'
import { Router, browserHistory } from 'react-router'
import addGraphQLSubscriptions from './subscriptions';
import routes from '../routes'
import { app as settings } from '../../package.json'

import '../ui/bootstrap.scss'
import '../ui/styles.scss'

const wsClient = new Client(`ws://localhost:${settings.wsPort}`);

const networkInterface = createNetworkInterface({
  uri: '/graphql',
  opts: {
    credentials: 'same-origin',
  },
  transportBatching: true
});

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient,
);

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
  queryTransformer: addTypename,
  dataIdFromObject: (result) => {
    if (result.id && result.__typename) { // eslint-disable-line no-underscore-dangle
      return result.__typename + result.id; // eslint-disable-line no-underscore-dangle
    }
    return null;
  },
  shouldBatch: true,
  initialState: window.__APOLLO_STATE__, // eslint-disable-line no-underscore-dangle
  ssrForceFetchDelay: 100,
});

export default class Main extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Router history={browserHistory}>
          {routes}
        </Router>
      </ApolloProvider>
    );
  }
}