import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, View } from 'react-native';
import StandardPagination from './Pagination';
import paginationConfig from '../../../../../../../../../config/pagination';

const renderStandardPagination = (pagination, totalPages, handlePageChange) => {
  if (pagination === paginationConfig.paginationTypes.standard) {
    return <StandardPagination totalPages={totalPages} handlePageChange={handlePageChange} pagination={pagination} />;
  }
};

const Table = ({ posts, renderItem, handlePageChange, keyExtractor, limit, pagination }) => {
  let onEndReachedCalledDuringMomentum = false;
  return (
    <View>
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
          if (pagination === paginationConfig.paginationTypes.relay && !onEndReachedCalledDuringMomentum) {
            if (posts.pageInfo.hasNextPage) {
              onEndReachedCalledDuringMomentum = true;
              return handlePageChange(paginationConfig.paginationTypes.relay, null);
            }
          }
        }}
      />
      {renderStandardPagination(pagination, Math.ceil(posts.totalCount / limit), handlePageChange)}
    </View>
  );
};

Table.propTypes = {
  posts: PropTypes.object,
  renderItem: PropTypes.func,
  handlePageChange: PropTypes.func,
  keyExtractor: PropTypes.func,
  limit: PropTypes.number,
  pagination: PropTypes.string
};

export default Table;
