import React from 'react';
import { Platform } from 'react-native';
import DatePickerIOS from './DatePickerIOS';
import DatePickerAndroid from './DatePickerAndroid';

const RenderDatePicker = ({ ...props }) => {
  return Platform.OS === 'ios' ? <DatePickerIOS {...props} /> : <DatePickerAndroid {...props} />;
};

export default RenderDatePicker;
