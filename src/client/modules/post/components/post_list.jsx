import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, ListView, ScrollView, Button } from 'react-native';

// Row comparison function
const rowHasChanged = (r1, r2) => r1.id !== r2.id;

// DataSource template object
const ds = new ListView.DataSource({ rowHasChanged });

const renderRow = (rowData) => {
  return (
    <Text style={styles.row}>
      {rowData.title}
    </Text>
  );
};

function renderLoadMore(postsQuery, loadMoreRows) {
  if (postsQuery.pageInfo.hasNextPage) {
    return (
      <View style={styles.row}>
        <Button title="More" onPress={loadMoreRows} />
      </View>
    );
  }
}

const PostList = ({ loading, postsQuery, loadMoreRows }) => {

    if (loading) {
      return (
        <View style={styles.container}>
          <Text>
            Loading...
          </Text>
        </View>
      );
    } else {
      const rows = postsQuery.edges.reduce((prev, { node }) => {
        prev.push(node);
        return prev;
      }, []);

      const dataSource = ds.cloneWithRows(rows);

      return (
        <ScrollView>
          <ListView
            style={styles.container}
            dataSource={dataSource}
            renderRow={renderRow}
            removeClippedSubviews={false}
          />
          {renderLoadMore(postsQuery, loadMoreRows)}
        </ScrollView>
      );
    }
};

PostList.propTypes = {
  loading: PropTypes.bool.isRequired,
  postsQuery: PropTypes.object,
  deletePost: PropTypes.func.isRequired,
  loadMoreRows: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    padding: 15,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default PostList;