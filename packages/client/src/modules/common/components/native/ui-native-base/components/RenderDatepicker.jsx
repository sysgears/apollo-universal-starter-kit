import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, DatePickerAndroid, StyleSheet } from 'react-native';
import { Input, Item } from 'native-base';
import InputItemStyles from '../styles/InputItem';

class RenderDatepicker extends React.Component {
  constructor() {
    super();
    this.openDatePicker = this.openDatePicker.bind(this);
  }

  async openDatePicker() {
    try {
      const datepickerResult = await DatePickerAndroid.open({
        date: this.props.value ? new Date(this.props.value) : new Date()
      });

      if (datepickerResult.action === DatePickerAndroid.dateSetAction) {
        let validMonth = datepickerResult.month + 1;
        let month = validMonth > 9 ? validMonth : '0' + validMonth;
        let day = datepickerResult.day > 9 ? datepickerResult.day : '0' + datepickerResult.day;
        this.props.onChange(`${datepickerResult.year}-${month}-${day}`);
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  }

  render() {
    let { value, style, placeholder } = this.props;

    return (
      <View>
        <TouchableOpacity onPress={this.openDatePicker}>
          <Item style={[styles.item, style.item]}>
            <Input editable={false} value={value} placeholder={placeholder} />
          </Item>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create(InputItemStyles);

RenderDatepicker.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
  style: PropTypes.object,
  placeholder: PropTypes.string
};

export default RenderDatepicker;
