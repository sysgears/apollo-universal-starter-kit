import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ScrollView, View, Text, Platform, TouchableOpacity } from 'react-native';
import { SwipeAction, Select } from '../../common/components/native';
import translate from '../../../i18n';
import PaginationView from '../components/PaginationView.native';

@translate('pagination')
export default class PaginationContainer extends React.Component {
  static propTypes = {
    t: PropTypes.func,
    data: PropTypes.object,
    loadData: PropTypes.func
  };

  state = { pagination: 'standard' };

  onPickerChange = itemValue => {
    const { loadData, data } = this.props;
    this.setState({ pagination: itemValue }, loadData(0, data.limit));
  };

  handlePageChange = (pagination, pageNumber) => {
    const { loadData, data } = this.props;
    if (pagination === 'relay') {
      loadData(data.pageInfo.endCursor + 1, 'add');
    } else {
      loadData((pageNumber - 1) * data.limit, 'replace');
    }
  };

  renderPagination = () => {
    const { data } = this.props;
    const { pagination } = this.state;
    const renderItem = Platform.OS === 'android' ? this.renderItemAndroid : this.renderItemIOS;
    return (
      <View>
        <PaginationView
          data={data}
          handlePageChange={this.handlePageChange}
          renderItem={renderItem}
          pagination={pagination}
        />
      </View>
    );
  };

  renderItemIOS = ({
    item: {
      node: { title }
    }
  }) => {
    return <SwipeAction>{title}</SwipeAction>;
  };

  renderItemAndroid = ({
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

  render() {
    const { t } = this.props;
    const { pagination } = this.state;
    const options = [
      { value: 'standard', label: t('list.title.standard') },
      { value: 'relay', label: t('list.title.relay') }
    ];
    return (
      <ScrollView style={styles.container}>
        <Select
          data={options}
          selectedValue={pagination}
          onValueChange={this.onPickerChange}
          okText={t('select.ok')}
          dismissText={t('select.dismiss')}
          cols={1}
        />
        {this.renderPagination()}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
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
  }
});
