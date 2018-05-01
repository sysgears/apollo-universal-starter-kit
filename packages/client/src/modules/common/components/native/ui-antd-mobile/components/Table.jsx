import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, Text, View } from 'react-native';
import { Pagination } from 'antd-mobile/lib';

const RELAY_PAGINATION = 'relay';
const STANDARD_PAGINATION = 'standard';

const Table = ({
  loading,
  posts,
  renderItem,
  loadMessage,
  handlePageChange,
  styles,
  keyExtractor,
  limit,
  pagination
}) => {
  let onEndReachedCalledDuringMomentum = false;
  const totalPages = Math.ceil(posts.totalCount / limit);
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>{loadMessage}</Text>
      </View>
    );
  } else {
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
            if (!onEndReachedCalledDuringMomentum && pagination === RELAY_PAGINATION) {
              if (posts.pageInfo.hasNextPage) {
                onEndReachedCalledDuringMomentum = true;
                return handlePageChange(RELAY_PAGINATION, null);
              }
            }
          }}
        />
        {renderPagination(pagination, totalPages, handlePageChange)}
      </View>
    );
  }
};

const renderPagination = (pagination, totalPages, handlePageChange) => {
  if (pagination === STANDARD_PAGINATION) {
    return (
      <Pagination
        total={totalPages}
        current={1}
        locale={locale}
        onChange={pageNumber => handlePageChange(STANDARD_PAGINATION, pageNumber)}
      />
    );
  }
};

const locale = {
  prevText: '<',
  nextText: '>'
};

Table.propTypes = {
  loading: PropTypes.bool,
  posts: PropTypes.object,
  renderItem: PropTypes.func,
  loadMessage: PropTypes.string,
  handlePageChange: PropTypes.func,
  styles: PropTypes.object,
  keyExtractor: PropTypes.func,
  limit: PropTypes.number,
  pagination: PropTypes.string
};

export default Table;
export { RELAY_PAGINATION, STANDARD_PAGINATION };
