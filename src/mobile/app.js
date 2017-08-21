import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-native';
import { ApolloProvider } from 'react-apollo';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { composeWithDevTools } from 'redux-devtools-extension';
import ApolloClient from 'apollo-client';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';

import modules from '../client/modules';
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
) => props => {
  const TabBarIconComponent = <TabBarIconComponent {...defaultProps} color={props.tintColor} />;

  TabBarIconComponent.propTypes = {
    tintColor: PropTypes.string,
  };

  return TabBarIconComponent;
};

class PostListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Post list',
    headerRight: ( <Button title="Add" onPress={() => navigation.navigate('PostEdit', { id: 0 })} /> )
  });
  render() {
    return <Post navigation={this.props.navigation} />;
  }
}

PostListScreen.propTypes = {
  navigation: PropTypes.func,
};

class PostEditScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.id === 0 ? 'Creacte' : 'Edit'} post`,
  });
  render() {
    return <PostEdit navigation={this.props.navigation} />;
  }
}

PostEditScreen.propTypes = {
  navigation: PropTypes.func,
};

const PostNavigator = StackNavigator({
  PostList: { screen: PostListScreen },
  PostEdit: { screen: PostEditScreen },
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
    form: formReducer,

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