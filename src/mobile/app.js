import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import ApolloClient from 'apollo-client';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { TabNavigator } from 'react-navigation';

import modules from '../client/modules/counter';
import Counter from '../client/modules/counter/containers/counter';
import PostList from '../client/modules/post/components/post_list';

const networkInterface = new SubscriptionClient(__BACKEND_URL__.replace(/^http/, 'ws'), {
  reconnect: true
});

const client = new ApolloClient({
  networkInterface,
});

const MainScreenNavigator = TabNavigator({
  Counter: { screen: Counter },
  Post: { screen: PostList },
});

const store = createStore(
  combineReducers({
    apollo: client.reducer(),

    ...modules.reducers
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
        <MainScreenNavigator />
      </ApolloProvider>
    );
  }
}