import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { translate } from '@gqlapp/i18n-client-react';
import { lookStyles, Select } from '@gqlapp/look-client-react-native';
import PaginationDemoView from '../components/PaginationDemoView.native';
import useDataProvider from './DataProvider';

const Item = ({
  item: {
    node: { title }
  }
}) => (
  <TouchableOpacity style={styles.postWrapper}>
    <Text style={styles.text}>{title}</Text>
  </TouchableOpacity>
);

Item.propTypes = {
  item: PropTypes.object
};

const PaginationDemo = ({ t }) => {
  const [pagination, setPagination] = useState('standard');
  const { items, loadData } = useDataProvider();

  const onPaginationTypeChange = itemValue => {
    setPagination(itemValue);
    loadData(0, items.limit);
  };

  const handlePageChange = (pagination, pageNumber) => {
    if (pagination === 'relay') {
      loadData(items.pageInfo.endCursor, 'add');
    } else {
      loadData((pageNumber - 1) * items.limit, 'replace');
    }
  };

  const options = [
    { value: 'standard', label: t('list.title.standard') },
    { value: 'relay', label: t('list.title.relay') },
    { value: 'scroll', label: t('list.title.scroll') }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        <View style={[styles.itemAction, styles.itemSelect]}>
          <Select
            icon
            iconName="caret-down"
            mode="dropdown"
            data={options}
            selectedValue={pagination}
            onChange={onPaginationTypeChange}
            okText={t('list.select.ok')}
            dismissText={t('list.select.dismiss')}
            cols={1}
          />
        </View>
      </View>
      {items && (
        <PaginationDemoView
          items={items}
          handlePageChange={handlePageChange}
          renderItem={Item}
          pagination={pagination}
        />
      )}
    </View>
  );
};

PaginationDemo.propTypes = {
  t: PropTypes.func,
  items: PropTypes.object,
  loadData: PropTypes.func
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 7
  },
  text: {
    fontSize: 16
  },
  postWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomColor: '#000',
    borderBottomWidth: 0.3,
    height: 48
  },
  itemContainer: {
    flex: 0.1
  },
  itemAction: lookStyles.itemAction,
  itemTitle: lookStyles.itemTitle,
  itemSelect: {
    flex: 25
  }
});

export default translate('pagination')(PaginationDemo);
