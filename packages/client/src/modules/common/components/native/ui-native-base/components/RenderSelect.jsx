import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, View, Text } from 'react-native';
import Select from './Select';
import RenderSelectStyles from '../styles/RenderSelect';

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
            <Select {...props} />
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

const styles = StyleSheet.create(RenderSelectStyles);

export default RenderSelect;
