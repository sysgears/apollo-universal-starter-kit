/*eslint-disable react/display-name*/
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, FlatList, Text, View } from 'react-native';
import { SwipeAction } from '../../common/components/native';

export default class PostList extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    posts: PropTypes.object,
    navigation: PropTypes.object,
    deletePost: PropTypes.func.isRequired,
    loadMoreRows: PropTypes.func.isRequired
  };

  onEndReachedCalledDuringMomentum = false;

  keyExtractor = item => item.node.id;

  renderItem = ({ item: { node: { id, title } } }) => {
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

  render() {
    const { loading, posts, loadMoreRows } = this.props;

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
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
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

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
