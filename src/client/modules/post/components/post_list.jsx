import React from 'react';
import { StyleSheet, Text, View, ListView, ScrollView } from 'react-native';

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

const PostList = ({ loading, postsQuery }) => {

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
        </ScrollView>
      );
    }
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
  },
});

export default PostList;