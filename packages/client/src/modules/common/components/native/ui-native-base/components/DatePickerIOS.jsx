import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, StyleSheet, DatePickerIOS as DatePickerIOSNative, Text } from 'react-native';
import DatePickerStyles from '../styles/DatePicker';

class DatePickerIOS extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string,
    style: PropTypes.object,
    placeholder: PropTypes.string
  };

  constructor() {
    super();
    this.setDate = this.setDate.bind(this);
    this.toggleDatePicker = this.toggleDatePicker.bind(this);
    this.state = {
      showDatePicker: false
    };
  }

  setDate(newDate) {
    if (!(newDate instanceof Date)) {
      return false;
    }
    let validMonth = newDate.getMonth() + 1;
    let month = validMonth > 9 ? validMonth : '0' + validMonth;
    let day = newDate.getDate();
    if (day < 10) {
      day = '0' + day;
    }
    this.props.onChange(`${newDate.getFullYear()}-${month}-${day}`);
  }

  toggleDatePicker() {
    if (this.state.showDatePicker) {
      return this.setState({ showDatePicker: false });
    }
    this.setState({ showDatePicker: true });
  }

  render() {
    let { value, style, placeholder } = this.props;
    let datePicker = <View />;
    if (this.state.showDatePicker) {
      datePicker = (
        <View>
          <DatePickerIOSNative date={value ? new Date(value) : new Date()} onDateChange={this.setDate} mode="date" />
        </View>
      );
    }
    return (
      <View style={[styles.container, style.container]}>
        <TouchableOpacity onPress={this.toggleDatePicker}>
          <View style={[styles.item, style.item]}>
            <Text style={[styles.input, style.input]}>{value ? value : placeholder}</Text>
          </View>
        </TouchableOpacity>
        {datePicker}
      </View>
    );
  }
}

const styles = StyleSheet.create(DatePickerStyles);

export default DatePickerIOS;
