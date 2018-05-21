import React from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, StyleSheet } from 'react-native';
import { Pagination } from '../../common/components/native';

import translate from '../../../i18n';

const RelayView = ({ data, handlePageChange, renderItem, t }) => {
  return (
    <View>
      <FlatList
        data={data.edges}
        style={styles.list}
        keyExtractor={item => `${item.node.id}`}
        renderItem={renderItem}
      />
      <Pagination
        totalPages={Math.ceil(data.totalCount / data.limit)}
        handlePageChange={handlePageChange}
        pagination="relay"
        loadMoreText={t('list.btn.more')}
        hasNextPage={data.pageInfo.hasNextPage}
      />
    </View>
  );
};

RelayView.propTypes = {
  t: PropTypes.func,
  data: PropTypes.object,
  handlePageChange: PropTypes.func,
  renderItem: PropTypes.func
};

const styles = StyleSheet.create({
  list: {
    marginTop: 5
  }
});

export default translate('pagination')(RelayView);
