import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from 'react-apollo';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import ApolloClient from 'apollo-client';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';

import modules from '../client/modules/counter';
import Counter from '../client/modules/counter/containers/counter';
import PostList from '../client/modules/post/components/post_list';

const networkInterface = new SubscriptionClient(__BACKEND_URL__.replace(/^http/, 'ws'), {
  reconnect: true
});

const client = new ApolloClient({
  networkInterface,
});

const createTabBarIconWrapper = (
  TabBarIconComponent,
  defaultProps
) => props => <TabBarIconComponent {...defaultProps} color={props.tintColor} />;

createTabBarIconWrapper.propTypes = {
  tintColor: PropTypes.string
};


const PostNavigator = StackNavigator({
  Post: {
    screen: PostList,
    navigationOptions: () => ({
      title: 'Post List',
    })
  },
});

const MainScreenNavigator = TabNavigator({
  Counter: {
    screen: Counter,
    navigationOptions: () => ({
    tabBarIcon: createTabBarIconWrapper(Ionicons, {
      name: 'ios-home-outline',
      size: 30
    })
  }) },
  Post: {
    screen: PostNavigator,
    navigationOptions: () => ({
      title: 'Post',
      tabBarIcon: createTabBarIconWrapper(Ionicons, {
        name: 'ios-book-outline',
        size: 30
      })
    })
  },
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