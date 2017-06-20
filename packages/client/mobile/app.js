import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import ApolloClient from 'apollo-client';
import { SubscriptionClient } from 'subscriptions-transport-ws';

import modules from '../common/modules/counter';
import Counter from '../common/modules/counter/containers/counter';

const networkInterface = new SubscriptionClient(__BACKEND_URL__.replace(/^http/, 'ws'), {
  reconnect: true
});

const client = new ApolloClient({
  networkInterface,
});

const store = createStore(
  combineReducers({
    apollo: client.reducer(),

    ...modules.reducers
  }),
  {}, // initial state
  applyMiddleware(client.middleware())
);

export default class Main extends Component {
  render() {
    return (
      <ApolloProvider store={store} client={client}>
        <Counter/>
      </ApolloProvider>
    );
  }
}