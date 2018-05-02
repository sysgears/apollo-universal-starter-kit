import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import Select from './Select';

const RenderSelect = ({ label, ...props }) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{label}</Text>
      <View style={styles.itemAction}>
        <Select iconName="caret-down" icon {...props} />
      </View>
    </View>
  );
};

RenderSelect.propTypes = {
  onValueChange: PropTypes.func,
  label: PropTypes.string,
  cols: PropTypes.number,
  onChange: PropTypes.func,
  value: PropTypes.string,
  selectedValue: PropTypes.string
};

const styles = StyleSheet.create({
  pickerLabel: {
    backgroundColor: 'transparent',
    borderBottomColor: 'red'
  },
  itemContainer: {
    paddingLeft: 15,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemTitle: {
    flex: 5,
    fontSize: 16
  },
  itemAction: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'flex-end'
  }
});

export default RenderSelect;
