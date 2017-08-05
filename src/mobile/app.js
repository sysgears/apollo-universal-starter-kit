/*eslint-disable react/display-name*/
/*eslint-disable react/prop-types*/
import React, { Component } from 'react';
import { Button } from 'react-native';
import { ApolloProvider } from 'react-apollo';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import ApolloClient from 'apollo-client';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';

import modules from '../client/modules/counter';
import Counter from '../client/modules/counter/containers/counter';
import Post from '../client/modules/post/containers/post';
import PostEdit from '../client/modules/post/containers/post_edit';

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


const PostNavigator = StackNavigator({
  PostList: {
    screen: Post,
    navigationOptions: {
      headerRight: <Button title="Add" onPress={() => console.log('add')} />
    }
  },
  PostEdit: { screen: PostEdit },
});

const MainScreenNavigator = TabNavigator({
  Counter: {
    screen: Counter,
    navigationOptions: {
      tabBarIcon: createTabBarIconWrapper(Ionicons, {
        name: 'ios-home-outline',
        size: 30
      })
    }
  },
  Post: {
    screen: PostNavigator,
    navigationOptions: {
      title: 'Post',
      tabBarIcon: createTabBarIconWrapper(Ionicons, {
        name: 'ios-book-outline',
        size: 30,
      })
    }
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