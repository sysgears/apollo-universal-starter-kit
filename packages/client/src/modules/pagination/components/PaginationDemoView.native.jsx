import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, FlatList, StyleSheet, Text } from 'react-native';
import { Pagination } from '../../common/components/native';

import translate from '../../../i18n';

class PaginationDemoView extends React.Component {
  render() {
    const { items, handlePageChange, renderItem, pagination, t } = this.props;

    const renderHeader = t => {
      return <Text style={styles.title}>{t}</Text>;
    };

    const handleScrollEvent = () => {
      if (this.allowDataLoad) {
        if (items.pageInfo.hasNextPage) {
          this.allowDataLoad = false;
          return handlePageChange('relay', null);
        }
      }
    };

    const titleTexti18n = t('list.column.title');
    this.allowDataLoad = true;
    return pagination === 'standard' ? (
      <View style={styles.container}>
        <View style={styles.listContainer}>
          <FlatList
            data={items.edges}
            style={styles.list}
            keyExtractor={item => `${item.node.id}`}
            renderItem={renderItem}
            ListHeaderComponent={renderHeader(titleTexti18n)}
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
            ListHeaderComponent={renderHeader(titleTexti18n)}
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
          ref={ref => (this.listRef = ref)}
          style={styles.list}
          keyExtractor={item => `${item.node.id}`}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader(titleTexti18n)}
          onEndReachedThreshold={0.5}
          onEndReached={handleScrollEvent}
        />
      </View>
    );
  }
}

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
