import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';

import counterReducer from '../client/modules/counter/reducers';
import Counter from '../client/modules/counter/containers/counter';

let networkInterface = createNetworkInterface({ uri: 'http://localhost:8080/graphql' });

const client = new ApolloClient({
  networkInterface,
});

const wsClient = new SubscriptionClient('ws://localhost:8080/graphql');

networkInterface = addGraphQLSubscriptions(
  networkInterface,
  wsClient,
);

const store = createStore(
  combineReducers({
    apollo: client.reducer(),
    counter: counterReducer,
  }),
  {}, // initial state
  composeWithDevTools(
    applyMiddleware(client.middleware()),
  ),
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