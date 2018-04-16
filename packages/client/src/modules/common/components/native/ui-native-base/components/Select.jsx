import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet } from 'react-native';
import { Picker, Item } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';

const Select = ({
  icon,
  iconName,
  iconColor,
  iconSize,
  data,
  onValueChange,
  selectedValue,
  value,
  onChange,
  style,
  ...props
}) => {
  return Platform.OS === 'ios' ? (
    <Item>
      {icon && (
        <FontAwesome name={iconName || 'filter'} size={iconSize || 20} style={{ color: `${iconColor || '#000'}` }} />
      )}
      <Picker style={style} onValueChange={onValueChange || onChange} selectedValue={selectedValue || value} {...props}>
        {data.map((option, idx) => <Picker.Item key={idx} label={option.label} value={option.value} />)}
      </Picker>
    </Item>
  ) : (
    <Item>
      <Picker
        style={[styles.androidPickerWrapper, style]}
        onValueChange={onValueChange || onChange}
        selectedValue={selectedValue || value}
        {...props}
      >
        {data.map((option, idx) => <Picker.Item key={idx} label={option.label} value={option.value} />)}
      </Picker>
    </Item>
  );
};

Select.propTypes = {
  data: PropTypes.array.isRequired,
  onValueChange: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.string,
  selectedValue: PropTypes.string,
  icon: PropTypes.bool,
  iconName: PropTypes.string,
  iconColor: PropTypes.string,
  iconSize: PropTypes.number,
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.number])
};

const styles = StyleSheet.create({
  androidPickerWrapper: {
    flex: 1
  }
});

export default Select;
