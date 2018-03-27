import React from 'react';
import { Button } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Ionicons from '@expo/vector-icons/Ionicons';

import { createTabBarIconWrapper } from '../common/components/native';

import Post from './containers/Post.native';
import PostEdit from './containers/PostEdit.native';

import clientStateParams from './resolvers';
import { PostProps } from './types';

import Feature from '../connector.native';

class PostListScreen extends React.Component<PostProps, any> {
  public static navigationOptions = ({ navigation }: any) => ({
    title: 'Post list',
    headerRight: <Button title="Add" onPress={() => navigation.navigate('PostEdit', { id: 0 })} />
  });

  public render() {
    return <Post navigation={this.props.navigation} />;
  }
}

class PostEditScreen extends React.Component<PostProps, any> {
  public static navigationOptions = ({ navigation }: any) => ({
    title: `${navigation.state.params.id === 0 ? 'Create' : 'Edit'} post`
  });
  public render() {
    return <PostEdit navigation={this.props.navigation} />;
  }
}

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
  clientStateParams
});
