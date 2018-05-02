import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, View, Text } from 'react-native';
import Select from './Select';

const RenderSelect = ({ style, label, ...props }) => {
  const selectProps = {
    iconName: 'caret-down',
    icon: true,
    iconSize: 20,
    ...props
  };
  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' ? (
        <View style={styles.itemContainer}>
          {label && <Text style={styles.itemTitle}>{label}</Text>}
          <View style={styles.itemAction}>
            <Select {...selectProps} />
          </View>
        </View>
      ) : (
        <View style={styles.itemContainer}>
          {label && <Text style={styles.itemTitle}>{label}</Text>}
          <View style={styles.itemAction}>
            <Select style={[styles.androidPickerWrapper, style]} {...props} />
          </View>
        </View>
      )}
    </View>
  );
};

RenderSelect.propTypes = {
  style: PropTypes.number,
  label: PropTypes.string
};

const styles = StyleSheet.create({
  androidPickerWrapper: {
    flex: 1
  },
  container: {
    paddingLeft: 15
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemTitle: {
    flex: 5,
    fontSize: 16,
    flexDirection: 'column'
  },
  itemAction: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end'
  }
});

export default RenderSelect;
