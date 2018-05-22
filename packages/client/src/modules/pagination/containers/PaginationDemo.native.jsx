import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, Platform, TouchableOpacity, Picker } from 'react-native';
import { SwipeAction } from '../../common/components/native';
import translate from '../../../i18n';
import PaginationDemoView from '../components/PaginationDemoView.native';
import withDataProvider from '../containers/DataProvider';

@translate('pagination')
class PaginationDemo extends React.Component {
  static propTypes = {
    t: PropTypes.func,
    data: PropTypes.object,
    loadData: PropTypes.func
  };

  state = { pagination: 'standard' };

  onPaginationTypeChange = itemValue => {
    const { loadData, data } = this.props;
    this.setState({ pagination: itemValue }, loadData(0, data.limit));
  };

  handlePageChange = (pagination, pageNumber) => {
    const { loadData, data } = this.props;
    if (pagination === 'relay') {
      loadData(data.pageInfo.endCursor, 'add');
    } else {
      loadData((pageNumber - 1) * data.limit, 'replace');
    }
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
    const { t, data } = this.props;
    const { pagination } = this.state;
    const renderItem = Platform.OS === 'android' ? this.renderItemAndroid : this.renderItemIOS;
    return (
      <View style={styles.container}>
        <Picker selectedValue={pagination} onValueChange={this.onPaginationTypeChange}>
          <Picker.Item label={t('list.title.standard')} value="standard" />
          <Picker.Item label={t('list.title.relay')} value="relay" />
        </Picker>
        <PaginationDemoView
          data={data}
          handlePageChange={this.handlePageChange}
          renderItem={renderItem}
          pagination={pagination}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
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
    height: 48,
    paddingLeft: 7
  }
});

const PaginationDemoWithData = withDataProvider(PaginationDemo);

export default PaginationDemoWithData;
