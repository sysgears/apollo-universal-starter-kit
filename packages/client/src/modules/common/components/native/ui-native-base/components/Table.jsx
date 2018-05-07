import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, ScrollView } from 'react-native';
import StandardPagination from './Pagination';

const renderStandardPagination = (pagination, totalPages, handlePageChange) => {
  if (pagination === 'standard') {
    return <StandardPagination totalPages={totalPages} handlePageChange={handlePageChange} pagination={pagination} />;
  }
};

const Table = ({ posts, renderItem, handlePageChange, keyExtractor, itemsNumber, pagination }) => {
  let onEndReachedCalledDuringMomentum = false;
  return (
    <ScrollView style={{ flex: 1 }}>
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
      {renderStandardPagination(pagination, Math.ceil(posts.totalCount / itemsNumber), handlePageChange)}
    </ScrollView>
  );
};

Table.propTypes = {
  posts: PropTypes.object,
  renderItem: PropTypes.func,
  handlePageChange: PropTypes.func,
  keyExtractor: PropTypes.func,
  itemsNumber: PropTypes.number,
  pagination: PropTypes.string
};

export default Table;
