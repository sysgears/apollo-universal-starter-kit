import React from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { Pagination } from '../../common/components/native';

import translate from '../../../i18n';

const PaginationDemoView = ({ items, handlePageChange, renderItem, pagination, t }) => {
  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <Text style={styles.title}>{t('list.column.title')}</Text>
        {items && (
          <FlatList
            data={items.edges}
            style={styles.list}
            keyExtractor={item => `${item.node.id}`}
            renderItem={renderItem}
          />
        )}
      </View>
      <View style={styles.pagination}>
        <Pagination
          totalPages={Math.ceil(items.totalCount / items.limit)}
          handlePageChange={handlePageChange}
          pagination={pagination}
          loadMoreText={t('list.btn.more')}
          hasNextPage={items.pageInfo.hasNextPage}
        />
      </View>
    </View>
  );
};

PaginationDemoView.propTypes = {
  t: PropTypes.func,
  items: PropTypes.object,
  handlePageChange: PropTypes.func,
  renderItem: PropTypes.func,
  pagination: PropTypes.string
};

const styles = StyleSheet.create({
  list: {
    marginTop: 5
  },
  title: {
    marginTop: 5,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 16,
    paddingLeft: 7,
    borderBottomColor: '#000',
    borderBottomWidth: 0.3,
    borderTopColor: '#000',
    borderTopWidth: 0.3
  },
  pagination: {
    flex: 0.13
  },
  container: {
    flex: 1
  },
  listContainer: {
    flex: 1
  }
});

export default translate('pagination')(PaginationDemoView);
