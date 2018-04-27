import React from 'react';
import PropTypes from 'prop-types';
import { Picker, List } from 'antd-mobile/lib';
import { FontAwesome } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';

const Select = ({
  icon,
  iconName,
  iconColor,
  iconSize,
  placeholder,
  onValueChange,
  onChange,
  selectedValue,
  value,
  ...props
}) => {
  return (
    <View style={styles.container}>
      {icon && (
        <View style={styles.iconWrapper}>
          <FontAwesome name={iconName || 'filter'} size={iconSize || 20} style={{ color: `${iconColor || '#000'}` }} />
        </View>
      )}
      <View style={styles.pickerWrapper}>
        <Picker onChange={onValueChange || onChange} value={[selectedValue || value]} {...props}>
          <List.Item>{placeholder}</List.Item>
        </Picker>
      </View>
    </View>
  );
};

Select.propTypes = {
  data: PropTypes.array.isRequired,
  onValueChange: PropTypes.func,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  selectedValue: PropTypes.string,
  icon: PropTypes.bool,
  iconName: PropTypes.string,
  iconColor: PropTypes.string,
  iconSize: PropTypes.number
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  iconWrapper: {
    flex: 1
  },
  pickerWrapper: {
    flex: 14
  }
});

export default Select;
