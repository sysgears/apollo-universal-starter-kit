import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Picker, ScrollView, View } from 'react-native';
import translate from '../../../i18n';
import StandardView from '../components/StandardView.native';
import RelayView from '../components/RelayView.native';

@translate('pagination')
export default class Pagination extends React.Component {
  static propTypes = {
    t: PropTypes.func,
    data: PropTypes.object,
    loadData: PropTypes.func
  };

  state = { pagination: 'standard' };

  onPickerChange = itemValue => {
    this.setState({ pagination: itemValue }, this.props.loadData(0, this.props.data.limit));
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
    return this.state.pagination === 'standard' ? (
      <View>
        <StandardView data={data} handlePageChange={this.handlePageChange} />
      </View>
    ) : (
      <View>
        <RelayView data={data} handlePageChange={this.handlePageChange} />
      </View>
    );
  };

  render() {
    const { t } = this.props;
    return (
      <ScrollView style={styles.container}>
        <Picker selectedValue={this.state.pagination} onValueChange={this.onPickerChange}>
          <Picker.Item label={t('list.title.standard')} value="standard" />
          <Picker.Item label={t('list.title.relay')} value="relay" />
        </Picker>
        {this.renderPagination()}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
