/*eslint-disable react/display-name*/
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet, FlatList, Text, View, Platform, TouchableOpacity } from 'react-native';
import { SwipeAction } from '../../common/components/native';

import { PostListProps, LoadMoreRowsFn, Posts, Post } from '../types/post';

interface Node {
  node: Post;
}

interface RenderItemOptions {
  item: Node;
}

export default class PostList extends React.PureComponent<PostListProps, any> {
  public onEndReachedCalledDuringMomentum = false;

  public keyExtractor = (item: any) => item.node.id;

  public renderItemIOS = ({ item: { node: { id, title } } }: RenderItemOptions) => {
    const { deletePost, navigation } = this.props;
    return (
      <SwipeAction
        onPress={() => navigation.navigate('PostEdit', { id })}
        right={{
          text: 'Delete',
          onPress: () => deletePost(id)
        }}
      >
        {title}
      </SwipeAction>
    );
  };

  public renderItemAndroid = ({ item: { node: { id, title } } }: RenderItemOptions) => {
    const { deletePost, navigation } = this.props;
    return (
      <TouchableOpacity style={styles.postWrapper} onPress={() => navigation.navigate('PostEdit', { id })}>
        <Text style={styles.text}>{title}</Text>
        <TouchableOpacity style={styles.iconWrapper} onPress={() => deletePost(id)}>
          <FontAwesome name="trash" size={20} style={{ color: '#3B5998' }} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  public render() {
    const { loading, posts, loadMoreRows } = this.props;
    const renderItem: any = Platform.OS === 'android' ? this.renderItemAndroid : this.renderItemIOS;
    if (loading) {
      return (
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      );
    } else {
      return (
        <FlatList
          data={posts.edges}
          style={{ marginTop: 5 }}
          keyExtractor={this.keyExtractor}
          renderItem={renderItem}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {
            this.onEndReachedCalledDuringMomentum = false;
          }}
          onEndReached={() => {
            if (!this.onEndReachedCalledDuringMomentum) {
              if (posts.pageInfo.hasNextPage) {
                this.onEndReachedCalledDuringMomentum = true;
                return loadMoreRows();
              }
            }
          }}
        />
      );
    }
  }
}

const styles: any = StyleSheet.create({
  container: {
    flex: 1
  },
  text: {
    fontSize: 18
  },
  iconWrapper: {
    backgroundColor: 'transparent',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  postWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomColor: '#000',
    borderBottomWidth: 0.3,
    height: 50,
    paddingLeft: 7
  }
});
