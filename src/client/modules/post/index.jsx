import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';

import { createTabBarIconWrapper } from '../common/components';

import Post from './containers/Post';
import PostEdit from './containers/PostEdit';

import reducers from './reducers';

import Feature from '../connector';

class PostListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Post list',
    headerRight: <Button title="Add" onPress={() => navigation.navigate('PostEdit', { id: 0 })} />
  });
  render() {
    return <Post navigation={this.props.navigation} />;
  }
}

PostListScreen.propTypes = {
  navigation: PropTypes.object
};

class PostEditScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.id === 0 ? 'Create' : 'Edit'} post`
  });
  render() {
    return <PostEdit navigation={this.props.navigation} />;
  }
}

PostEditScreen.propTypes = {
  navigation: PropTypes.object
};

const PostNavigator = StackNavigator({
  PostList: { screen: PostListScreen },
  PostEdit: { screen: PostEditScreen }
});

export default new Feature({
  tabItem: {
    Post: {
      screen: PostNavigator,
      navigationOptions: {
        tabBarIcon: createTabBarIconWrapper(Ionicons, {
          name: 'ios-book-outline',
          size: 30
        })
      }
    }
  },
  reducer: { post: reducers }
});
