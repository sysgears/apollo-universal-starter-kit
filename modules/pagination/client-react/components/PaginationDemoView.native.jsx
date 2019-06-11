import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, FlatList, StyleSheet, Text } from 'react-native';
import { Pagination } from '@gqlapp/look-client-react-native';
import { translate } from '@gqlapp/i18n-client-react';

const PaginationDemoView = props => {
  const { items, handlePageChange, renderItem, pagination, t } = props;

  const renderHeader = () => <Text style={styles.title}>{t('list.column.title')}</Text>;

  return pagination === 'standard' ? (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <FlatList
          data={items.edges}
          style={styles.list}
          keyExtractor={item => `${item.node.id}`}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader()}
        />
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
  ) : pagination === 'relay' ? (
    <View style={styles.container}>
      <ScrollView>
        <FlatList
          data={items.edges}
          style={styles.list}
          keyExtractor={item => `${item.node.id}`}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader()}
        />
        <Pagination
          totalPages={Math.ceil(items.totalCount / items.limit)}
          handlePageChange={handlePageChange}
          pagination={pagination}
          loadMoreText={t('list.btn.more')}
          hasNextPage={items.pageInfo.hasNextPage}
        />
      </ScrollView>
    </View>
  ) : (
    <View style={styles.container}>
      <FlatList
        data={items.edges}
        style={styles.list}
        keyExtractor={item => `${item.node.id}`}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader()}
        onEndReachedThreshold={0.5}
        onEndReached={() => handlePageChange('relay', null)}
      />
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
    borderBottomColor: '#000',
    borderBottomWidth: 0.3,
    borderTopColor: '#000',
    borderTopWidth: 0.3
  },
  pagination: {
    flex: 0.15,
    marginTop: 5
  },
  container: {
    flex: 1,
    paddingHorizontal: 15
  },
  listContainer: {
    flex: 1
  }
});

export default translate('pagination')(PaginationDemoView);
