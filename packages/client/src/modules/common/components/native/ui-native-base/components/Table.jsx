import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, View } from 'react-native';
import StandardPagination from './Pagination';

const RELAY_PAGINATION = 'relay';
const STANDARD_PAGINATION = 'standard';

const renderStandardPagination = (pagination, totalPages, handlePageChange) => {
  if (pagination === STANDARD_PAGINATION) {
    return <StandardPagination totalPages={totalPages} handlePageChange={handlePageChange} />;
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
          if (pagination === RELAY_PAGINATION && !onEndReachedCalledDuringMomentum) {
            if (posts.pageInfo.hasNextPage) {
              onEndReachedCalledDuringMomentum = true;
              return handlePageChange(RELAY_PAGINATION, null);
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
export { RELAY_PAGINATION, STANDARD_PAGINATION };
