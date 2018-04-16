import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet } from 'react-native';
import { Item } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
import Select from './Select';

const RenderSelect = ({ style, ...props }) => {
  return Platform.OS === 'ios' ? (
    <Item>
      <Select {...props} />
      <FontAwesome name={'caret-down'} size={20} style={{ color: '#000' }} />
    </Item>
  ) : (
    <Item style={{ paddingHorizontal: 10 }}>
      <Select style={[styles.androidPickerWrapper, style]} {...props} />
    </Item>
  );
};

RenderSelect.propTypes = {
  style: PropTypes.number
};

const styles = StyleSheet.create({
  androidPickerWrapper: {
    flex: 1
  }
});

export default RenderSelect;
