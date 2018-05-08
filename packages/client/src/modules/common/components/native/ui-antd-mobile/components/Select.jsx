import React from 'react';
import PropTypes from 'prop-types';
import { Picker, List } from 'antd-mobile/lib';
import { FontAwesome } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import SelectStyles from '../styles/Select';

const Select = ({ icon, iconName, iconColor, iconSize, onValueChange, cols, selectedValue, value, ...props }) => {
  return (
    <View style={styles.container}>
      <View style={styles.pickerWrapper}>
        <Picker
          onChange={val => onValueChange(cols === 1 ? val[0] : val)}
          value={[selectedValue || value]}
          cols={cols || 1}
          {...props}
        >
          <List.Item style={styles.list}>
            {icon && (
              <FontAwesome
                name={iconName || 'filter'}
                size={iconSize || 20}
                style={{ color: `${iconColor || '#000'}` }}
              />
            )}
          </List.Item>
        </Picker>
      </View>
    </View>
  );
};

Select.propTypes = {
  onValueChange: PropTypes.func,
  cols: PropTypes.number,
  value: PropTypes.string,
  selectedValue: PropTypes.string,
  icon: PropTypes.bool,
  iconName: PropTypes.string,
  iconColor: PropTypes.string,
  iconSize: PropTypes.number
};

const styles = StyleSheet.create(SelectStyles);

export default Select;
