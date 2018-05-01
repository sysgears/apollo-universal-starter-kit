import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, Text, View } from 'react-native';

const Table = ({ loading, posts, renderItem, loadMessage, handlePageChange, styles, keyExtractor }) => {
  let onEndReachedCalledDuringMomentum = false;
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>{loadMessage}</Text>
      </View>
    );
  } else {
    return (
      <FlatList
        data={posts.edges}
        style={{ marginTop: 5 }}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={() => {
          onEndReachedCalledDuringMomentum = false;
        }}
        onEndReached={() => {
          if (!onEndReachedCalledDuringMomentum) {
            if (posts.pageInfo.hasNextPage) {
              onEndReachedCalledDuringMomentum = true;
              return handlePageChange();
            }
          }
        }}
      />
    );
  }
};

Table.propTypes = {
  loading: PropTypes.bool,
  posts: PropTypes.object,
  renderItem: PropTypes.func,
  loadMessage: PropTypes.string,
  handlePageChange: PropTypes.func,
  styles: PropTypes.object,
  keyExtractor: PropTypes.func
};

export default Table;
