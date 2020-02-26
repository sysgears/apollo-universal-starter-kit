import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet } from 'react-native';
import { Picker, Item } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
import SelectStyles from '../styles/Select';

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
  itemStyle,
  placeholder = '...',
  error,
  ...props
}) => {
  return Platform.OS === 'ios' ? (
    <Item style={styles.selectItemIos} error={!!error}>
      {icon && (
        <FontAwesome name={iconName || 'filter'} size={iconSize || 20} style={{ color: `${iconColor || '#000'}` }} />
      )}
      <Picker
        placeholder={placeholder}
        style={style}
        onValueChange={onValueChange || onChange}
        selectedValue={selectedValue || value}
        {...props}
      >
        {data.map((option, idx) => (
          <Picker.Item style={itemStyle} key={idx} label={option.label} value={option.value} />
        ))}
      </Picker>
    </Item>
  ) : (
    <Item style={styles.selectItemAndroid} error={!!error}>
      <Picker
        style={[styles.androidPickerWrapper, style]}
        onValueChange={onValueChange || onChange}
        selectedValue={selectedValue || value}
        {...props}
      >
        {data.map((option, idx) => (
          <Picker.Item style={itemStyle} key={idx} label={option.label} value={option.value} />
        ))}
      </Picker>
    </Item>
  );
};

Select.propTypes = {
  data: PropTypes.array.isRequired,
  onValueChange: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  selectedValue: PropTypes.string,
  placeholder: PropTypes.string,
  icon: PropTypes.bool,
  iconName: PropTypes.string,
  iconColor: PropTypes.string,
  iconSize: PropTypes.number,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  itemStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  error: PropTypes.string
};

const styles = StyleSheet.create(SelectStyles);

export default Select;
