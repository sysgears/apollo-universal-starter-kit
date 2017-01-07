import React from 'react'
import { createBatchingNetworkInterface } from 'apollo-client'
import { Client } from 'subscriptions-transport-ws';
import { ApolloProvider } from 'react-apollo'
import { Router, browserHistory } from 'react-router'

import createApolloClient from '../apollo_client'
import addGraphQLSubscriptions from './subscriptions'
import routes from '../routes'
import { app as settings} from '../../package.json'

import '../ui/bootstrap.scss'
import '../ui/styles.scss'

const wsClient = new Client(window.location.origin.replace(/^http/, 'ws')
  .replace(':' + settings.webpackDevPort, ':' + settings.apiPort));

const networkInterface = createBatchingNetworkInterface({
  opts: {
    credentials: "same-origin",
  },
  batchInterval: 500,
  uri: "/graphql",
});

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient,
);

const client = createApolloClient(networkInterfaceWithSubscriptions);

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