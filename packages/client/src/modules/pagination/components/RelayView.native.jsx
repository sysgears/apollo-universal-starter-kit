import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, FlatList, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { SwipeAction, Pagination } from '../../common/components/native';

import translate from '../../../i18n';

const RelayView = ({ data, handlePageChange, t }) => {
  const renderItemIOS = ({
    item: {
      node: { title }
    }
  }) => {
    return <SwipeAction>{title}</SwipeAction>;
  };

  const renderItemAndroid = ({
    item: {
      node: { title }
    }
  }) => {
    return (
      <TouchableOpacity style={styles.postWrapper}>
        <Text style={styles.text}>{title}</Text>
      </TouchableOpacity>
    );
  };

  const renderItem = Platform.OS === 'android' ? renderItemAndroid : renderItemIOS;

  return (
    <View>
      <FlatList
        data={data.edges}
        style={{ marginTop: 5 }}
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
  item: PropTypes.object
};

const styles = StyleSheet.create({
  text: {
    fontSize: 18
  },
  postWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomColor: '#000',
    borderBottomWidth: 0.3,
    height: 48,
    paddingLeft: 7
  },
  container: {
    flex: 1
  },
  list: {
    marginTop: 5
  }
});

export default translate('pagination')(RelayView);
