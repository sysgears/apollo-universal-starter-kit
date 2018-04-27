import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { Picker, List } from 'antd-mobile';

const RenderSelect = ({ placeholder, onValueChange, selectedValue, value, onChange, cols, ...props }) => {
  return (
    <Picker
      onChange={val => onValueChange(cols === 1 ? val[0] : val)}
      cols={cols || 1}
      value={[selectedValue || value]}
      {...props}
    >
      <List.Item style={styles.pickerLabel}>{placeholder}</List.Item>
    </Picker>
  );
};

RenderSelect.propTypes = {
  onValueChange: PropTypes.func,
  placeholder: PropTypes.string,
  cols: PropTypes.number,
  onChange: PropTypes.func,
  value: PropTypes.string,
  selectedValue: PropTypes.string
};

const styles = StyleSheet.create({
  pickerLabel: {
    backgroundColor: 'transparent'
  }
});

export default RenderSelect;
