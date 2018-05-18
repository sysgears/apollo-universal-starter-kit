import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, Picker, ScrollView, View } from 'react-native';
import translate from '../../../i18n';
import StandardView from '../components/StandardView.native';
import RelayView from '../components/RelayView.native';

@translate('pagination')
export default class Pagination extends React.Component {
  static propTypes = {
    t: PropTypes.func
  };

  state = { pagination: 'standard' };

  onPickerChange = itemValue => {
    this.setState({ pagination: itemValue });
  };

  renderPagination = () => {
    const { t } = this.props;
    return this.state.pagination === 'standard' ? (
      <View>
        <Text>{t('list.title.standard')}</Text>
        <StandardView />
      </View>
    ) : (
      <View>
        <Text>{t('list.title.relay')}</Text>
        <RelayView />
      </View>
    );
  };

  render() {
    const { t } = this.props;
    return (
      <ScrollView style={styles.container}>
        <Picker selectedValue={this.state.pagination} onValueChange={this.onPickerChange}>
          <Picker.Item label="standard" value="standard">
            {t('list.title.standard')}
          </Picker.Item>
          <Picker.Item label="relay" value="relay">
            {t('list.title.relay')}
          </Picker.Item>
        </Picker>
        {this.renderPagination()}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
