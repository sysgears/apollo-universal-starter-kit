/*eslint-disable react/display-name*/
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, FlatList, Text, View, Button } from 'react-native';

class PostList extends React.PureComponent {
  keyExtractor = item => item.node.id;

  renderItem = ({ item: { node: { id, title } } }) => {
    const { deletePost, navigation } = this.props;
    return (
      <View style={styles.row}>
        <Button title={title} onPress={() => navigation.navigate('PostEdit', { id })} />
        <Button title="Delete" onPress={() => deletePost(id)} />
      </View>
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
          onEndReached={() => {
            if (posts.pageInfo.hasNextPage) {
              return loadMoreRows();
            }
          }}
        />
      );
    }
  }
}

PostList.propTypes = {
  loading: PropTypes.bool.isRequired,
  posts: PropTypes.object,
  navigation: PropTypes.object,
  deletePost: PropTypes.func.isRequired,
  loadMoreRows: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  element: {
    paddingTop: 30
  },
  box: {
    textAlign: 'center',
    marginLeft: 15,
    marginRight: 15
  },
  row: {
    padding: 5,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});

export default PostList;
