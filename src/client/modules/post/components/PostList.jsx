/*eslint-disable react/display-name*/
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, ListView, ScrollView, Button } from 'react-native';

// Row comparison function
const rowHasChanged = (r1, r2) => r1.id !== r2.id;

// DataSource template object
const ds = new ListView.DataSource({ rowHasChanged });

const renderRow = (deletePost, navigation) => rowData => {
  return (
    <View style={styles.row}>
      <Button
        title={rowData.title}
        onPress={() =>
          navigation.navigate('PostEdit', {
            id: rowData.id
          })}
      />
      <Button title="Delete" onPress={deletePost(rowData.id)} />
    </View>
  );
};

function renderLoadMore(posts, loadMoreRows) {
  if (posts.pageInfo.hasNextPage) {
    return (
      <View style={styles.row}>
        <Text>
          ({posts.edges.length} / {posts.totalCount})
        </Text>
        <Button title="Load More ..." onPress={loadMoreRows} />
      </View>
    );
  }
}

const PostList = ({ loading, posts, deletePost, loadMoreRows, navigation }) => {
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  } else {
    const rows = posts.edges.reduce((prev, { node }) => {
      prev.push(node);
      return prev;
    }, []);

    const dataSource = ds.cloneWithRows(rows);

    return (
      <ScrollView>
        <ListView
          style={styles.container}
          dataSource={dataSource}
          renderRow={renderRow(deletePost, navigation)}
          removeClippedSubviews={false}
        />
        {renderLoadMore(posts, loadMoreRows)}
      </ScrollView>
    );
  }
};

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
