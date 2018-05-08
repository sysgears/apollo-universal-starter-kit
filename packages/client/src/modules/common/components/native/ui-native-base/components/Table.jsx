import React from 'react';
import PropTypes from 'prop-types';
import { FlatList } from 'react-native';

const Table = ({ posts, renderItem, handlePageChange, keyExtractor, pagination }) => {
  let onEndReachedCalledDuringMomentum = false;
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
        if (pagination === 'relay' && !onEndReachedCalledDuringMomentum) {
          if (posts.pageInfo.hasNextPage) {
            onEndReachedCalledDuringMomentum = true;
            return handlePageChange('relay', null);
          }
        }
      }}
    />
  );
};

Table.propTypes = {
  posts: PropTypes.object,
  renderItem: PropTypes.func,
  handlePageChange: PropTypes.func,
  keyExtractor: PropTypes.func,
  pagination: PropTypes.string
};

export default Table;
