import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, StyleSheet, DatePickerAndroid as DatePickerAndroidNative, Text } from 'react-native';
import DatePickerStyles from '../styles/DatePicker';

class DatePickerAndroid extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string,
    style: PropTypes.object,
    placeholder: PropTypes.string
  };

  constructor() {
    super();
    this.openDatePicker = this.openDatePicker.bind(this);
  }

  async openDatePicker() {
    try {
      const datepickerResult = await DatePickerAndroidNative.open({
        date: this.props.value ? new Date(this.props.value) : new Date()
      });

      if (datepickerResult.action === DatePickerAndroidNative.dateSetAction) {
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
      <View style={[styles.container, style.container]}>
        <TouchableOpacity onPress={this.openDatePicker}>
          <View style={[styles.item, style.item]}>
            <Text style={[styles.input, style.input]}>{value ? value : placeholder}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

DatePickerAndroid.propsTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
  style: PropTypes.object,
  placeholder: PropTypes.string
};

const styles = StyleSheet.create(DatePickerStyles);

export default DatePickerAndroid;
